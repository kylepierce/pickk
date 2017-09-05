Router.route('/matchup', {
  name: "matchup",
  template: 'matchup',
  layoutTemplate: 'notificationLayout',
  yieldRegions: {
    'matchupFilter': {to: 'filter'}
  },
  waitOn: function () {
    var userId = Meteor.userId();
    var groupId = this.params._id
    return [
      Meteor.subscribe("liveGames"),
      Meteor.subscribe('activeGames', 'week', ["NBA", "NFL", "MLB"]),
      Meteor.subscribe('sectionHeros', ['matchup'])
    ]
  },
  data: function () {
    return {
      hero: Hero.find().fetch()
    }
  },
  onBeforeAction: function(){
    return this.next();
  }
});

// Router.route('/matchup/create', {
//   template: 'createMatchup',
//   waitOn: function () {
//     var userId = Meteor.userId();
//     var groupId = this.params._id
//     return [
//       Meteor.subscribe('userIsCommissioner', userId),
//       Meteor.subscribe("liveGames"),
//       Meteor.subscribe('activeGames', 'week', ["NBA", "NFL", "MLB"])
//     ]
//   },
//   data: function () {
//     return {}
//   },
//   onBeforeAction: function(){
//     return this.next();
//   }
// });

Router.route('/matchup/create/:step?', {
  name: 'create-matchup',
  template: 'createMatchup',
  waitOn: function () {
    var userId = Meteor.userId();
    var groupId = this.params._id
    return [
      Meteor.subscribe('userIsCommissioner', userId),
      Meteor.subscribe("liveGames"),
      Meteor.subscribe('activeGames', 'week', ["NBA", "NFL", "MLB"])
    ]
  },
  data: function () {
    return {
      games: Games.find({})
    }
  },
  onBeforeAction: function() {
    if (!this.params.step) {
      this.redirect('create-matchup', {
        step: 'selectUsers'
      });
    } else {
      this.next();
    }
  }
});

Router.route('/matchup/:_id', {
  name: 'matchup.show',
  template: 'singleMatchup',
  waitOn: function () {
    var userId = Meteor.userId();
    var matchupId = this.params._id
    return [
      Meteor.subscribe('singleMatchup', matchupId)
    ]
  },
  data: function () {
    return {
      matchup: Matchup.find({}).fetch()
    }
  },
  onBeforeAction: function(){
    return this.next();
  }
});

Router.route('/matchup/members/:_id/', {
  template: 'matchupMembers',
  waitOn: function () {
    var userId = Meteor.userId();
    var matchupId = this.params._id
    return [
      Meteor.subscribe('singleMatchup', matchupId),
      Meteor.subscribe("matchupUsers", matchupId)
    ]
  },
  data: function () {
    return {
      matchup: Matchup.find({}).fetch()
    }
  },
  onBeforeAction: function(){
    return this.next();
  }
});

Router.route('/matchup/invite/:_id', {
  template: 'inviteToMatchup',
  waitOn: function () {
    var matchupId = this.params._id
    return [
      Meteor.subscribe('singleMatchup', matchupId)
    ]
  },
  data: function() {
    return this.params;
  },
  onBeforeAction: function() {
    return this.next();
  }
});
