Router.route('/matchup', {
  name: "matchup",
  template: 'matchup',
  // layoutTemplate: 'notificationLayout',
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

Router.route('/matchup/create/:step?', {
  name: 'create-matchup',
  template: 'createMatchup',
  step: 'selectUsers',
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
  }
});

Router.route('/matchup/:_id', {
  name: 'matchup.show',
  template: 'singleMatchup',
  waitOn: function () {
    var userId = Meteor.userId();
    var matchupId = this.params._id
    var subscribe = [
      Meteor.subscribe('singleMatchup', matchupId)
    ]
    var matchup = Matchup.findOne({});
    if(matchup){
      subscribe.push(Meteor.subscribe('multipleGameData', matchup.gameId))
    }
    return subscribe
  },
  data: function () {
    return {
      matchup: Matchup.find({}).fetch(),
      games: Games.find({}).fetch()
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

Router.route('/matchup-history/', {
  template: 'matchupHistory',
  waitOn: function () {
    var userId = Meteor.userId()
    return [
      Meteor.subscribe('usersMatchups', userId)
    ]
  },
  data: function () {
    // return this.params;
  },
  onBeforeAction: function () {
    return this.next();
  }
});
