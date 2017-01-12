Router.route('/leaderboard', {
  subscriptions: function() {
    return [
      Meteor.subscribe('worldLeaderboard'),
    ];
  },
  data: function () {
    // leaderboard: UserList.find({})
  },
  onBeforeAction: function() {
    return this.next();
  }
});

Router.route('/leaderboard/:_id/:period', {
  name: 'gameLeaderboard',
  template: 'gameLeaderboard',

  waitOn: function(){
    var gameId = this.params._id
    var userId = Meteor.userId();
    var period = parseInt(this.params.period)
    if (!period){
      var period = -1
    }
    if (period === -1){
      Meteor.subscribe('singleGamePlayedIn', gameId, userId)
    }
    return [
      Meteor.subscribe('leaderboardGamePlayed', gameId, period, -1 )
    ]
  },

  data: function () {
    leaderboard: GamePlayed.find({})
  },
  onBeforeAction: function() {
    return this.next();
  }
});

Router.route('/week-leaderboard/', {
  name: 'week-leaderboard',
  template: 'week-leaderboard',
  layoutTemplate: "notificationLayout",
  yieldRegions: {
    'weekFilter': {to: 'filter'}
  },
  waitOn: function() {
    var week = moment().week()
    return [
      Meteor.subscribe('weekLeaderboard', week)
    ]
  },
  onBeforeAction: function() {
    return this.next();
  }
});

Router.route('/week-leaderboard/:id', {
  name: 'week-number-leaderboard',
  template: 'week-leaderboard',
  layoutTemplate: "notificationLayout",
  yieldRegions: {
    'weekFilter': {to: 'filter'}
  },
  waitOn: function() {
    var week = parseInt(this.params.id)

    return [
      Meteor.subscribe('weekLeaderboard', week)
    ]
  },
  onBeforeAction: function() {
    return this.next();
  }
});



Router.route('/beta-week-leaderboard', {
  template: 'betaWeekLeaderboard',

});
