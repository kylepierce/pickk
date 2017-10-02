Router.route('/games', {
  name: 'games',
  template: 'games',
  layoutTemplate: "notificationLayout",
  yieldRegions: {
    'gamesFilter': {to: 'filter'}
  },
  // 🚨🚨🚨
  waitOn: function() {
    return [Meteor.subscribe('userNotificationSettings')]
  },
  data: function () {
    var userId = Meteor.userId();
    var user = Meteor.user();
    return {
      user: user
    }
  },
  onBeforeAction: function () {
    return this.next()
  }
});

Router.route('/games/:day', {
  name: 'different-day-games',
  template: 'games',
  layoutTemplate: "notificationLayout",
  yieldRegions: {
    'gamesFilter': {to: 'filter'}
  }
});

Router.route('/game/:_id/', {
  name: 'game.show',
  template: 'singleGame',
  layoutTemplate: 'homeLayout',
});
