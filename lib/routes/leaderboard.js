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

Router.route('/leaderboard/:id', {
  name: 'gameLeaderboard',
  template: 'gameLeaderboard',
  fastRender: true,
  subscriptions: function(){
    return [
      Meteor.subscribe('leaderboardGamePlayed', this.params.id)
    ]
  }
})

Router.route('/week-leaderboard', {
  name: 'week-leaderboard',
  template: 'week-leaderboard',
  fastRender: true,
  waitOn: function() {
    return [
      Meteor.subscribe('weekLeaderboard')
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