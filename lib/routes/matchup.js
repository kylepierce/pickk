Router.route('/matchup', {
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
      Meteor.subscribe('activeGames', 'month', ["NBA", "NFL"])
    ]
  },
  data: function () {
    return {}
  },
  onBeforeAction: function(){
    return this.next();
  }
});

Router.route('/matchup/create', {
  template: 'createMatchup',
  waitOn: function () {
    var userId = Meteor.userId();
    var groupId = this.params._id
    return [
      Meteor.subscribe('userIsCommissioner', userId),
      Meteor.subscribe("liveGames"),
      Meteor.subscribe('activeGames', 'month', ["NBA", "NFL"])
    ]
  },
  data: function () {
    return {}
  },
  onBeforeAction: function(){
    return this.next();
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
