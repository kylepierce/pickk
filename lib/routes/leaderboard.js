// Router.route('/leaderboard', {
//   subscriptions: function() {
//     return [
//       Meteor.subscribe('worldLeaderboard'),
//     ];
//   },
//   data: function () {
//     // leaderboard: UserList.find({})
//   },
//   onBeforeAction: function() {
//     return this.next();
//   }
// });

Router.route('/leaderboard/', {
  name: 'gameLeaderboard',
  template: 'gameLeaderboard',
  layoutTemplate: "notificationLayout",
  yieldRegions: {
    'singleGameFilter': {to: 'filter'}
  },
  waitOn: function(){
    return []
  },
  data: function(){
    return {
    }
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
    'weekFilter': {to: 'filter'},
    'mainNav': {to: 'header'}
  },
  waitOn: function() {
    return [
      Meteor.subscribe('userData')
    ]
  },
  onBeforeAction: function() {
    return this.next();
  }
});

// Router.route('/week-leaderboard/:id', {
//   name: 'week-number-leaderboard',
//   template: 'week-leaderboard',
//   layoutTemplate: "notificationLayout",
//   yieldRegions: {
//     'weekFilter': {to: 'filter'}
//   },
//   waitOn: function() {
//     var week = parseInt(this.params.id)
//
//     return [
//       Meteor.subscribe('weekLeaderboard', week)
//     ]
//   },
//   onBeforeAction: function() {
//     return this.next();
//   }
// });
