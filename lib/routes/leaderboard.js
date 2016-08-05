Router.route('/leaderboard', {
  fastRender: true,
  subscriptions: function() {
    return [
      Meteor.subscribe('worldLeaderboard'),
      Meteor.subscribe('activeGames')
    ];
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
  template: 'week-leaderboard',
  fastRender: true,
});

Router.route('/beta-week-leaderboard', {
  template: 'betaWeekLeaderboard',
  fastRender: true,
});