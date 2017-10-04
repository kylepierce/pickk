Router.route('/leaderboard/', {
  name: 'gameLeaderboard',
  template: 'gameLeaderboard',
  layoutTemplate: "notificationLayout",
  yieldRegions: {
    'singleGameFilter': {to: 'filter'}
  },
});

Router.route('/week-leaderboard/', {
  name: 'week-leaderboard',
  template: 'week-leaderboard',
  layoutTemplate: "notificationLayout",
  yieldRegions: {
    'weekFilter': {to: 'filter'},
    'mainNav': {to: 'header'}
  },
});
