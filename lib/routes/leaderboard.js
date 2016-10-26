Router.route('/leaderboard', {
  fastRender: true,
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

Router.route('/leaderboard/:id/:count', {
  name: 'gameLeaderboard',
  template: 'gameLeaderboard',
  fastRender: true,
  subscriptions: function(){
    return [
      Meteor.subscribe('leaderboardGamePlayed', this.params.id, this.params.count )
    ]
  }
})

Router.route('/week-leaderboard/', {
  name: 'week-leaderboard',
  template: 'week-leaderboard',
  fastRender: true,
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
  fastRender: true,
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
  fastRender: true,
});