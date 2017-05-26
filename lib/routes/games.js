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
    var stringGameId = gameId.toString();
    var subscribe = [
      Meteor.subscribe('userData'),
      Meteor.subscribe('singleGame', stringGameId),
      Meteor.subscribe('gameNotifications', stringGameId, userId),
      Meteor.subscribe('singleGameMatchups', stringGameId)
    ]
    var game = Games.findOne({});
    var period = game.period
    Meteor.subscribe('joinGameCount', game._id , userId, period);
    var count = Counts.get('joinGameCount');
    subscribe.push(Meteor.subscribe('joinGameCount', game._id , userId, period))
    return subscribe
  },
  data: function () {
    return {
      game: Games.find({}).fetch(),
      coins: GamePlayed.find({}).fetch(),
      gamePlayed: Counts.get('joinGameCount')
    }
  },
  onBeforeAction: function(){
    return this.next();
  }
});

Router.route('/join-game/:_id/', {
  name: 'joinGame.show',
  template: 'joinGame',
  layoutTemplate: 'mainLayout',
  waitOn: function () {
    var userId = Meteor.userId();
    var gameId = this.params._id
    var stringGameId = gameId.toString();

    return [
      Meteor.subscribe('userData'),
      Meteor.subscribe('singleGame', stringGameId),
    ]
  },
  data: function () {
    return {
      game: Games.find({}).fetch(),
    }
  },
  onBeforeAction: function(){
    return this.next();
  }
});
