Router.route('/games', {
  name: 'games',
  template: 'games',
  layoutTemplate: "notificationLayout",
  yieldRegions: {
    'gamesFilter': {to: 'filter'}
  },
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
  },
  // waitOn: function() {
  //   var day = parseInt(this.params.day)
  //   return [
  //     Meteor.subscribe('activeGames', day)
  //   ]
  // },
});

Router.route('/game/:_id/', {
  name: 'game.show',
  template: 'singleGame',
  layoutTemplate: 'homeLayout',
  waitOn: function () {
    var userId = Meteor.userId();
    var gameId = this.params._id
    return [
      Meteor.subscribe('userData'),
      Meteor.subscribe('singleGame', gameId),
      Meteor.subscribe('gameNotifications', gameId, userId)
    ]
  },
  data: function () {
    return {
      game: Games.find({_id: this.params._id }).fetch(),
      coins: GamePlayed.find({}).fetch()
    }
  },
  onBeforeAction: function(){
    return this.next();
  }
});
