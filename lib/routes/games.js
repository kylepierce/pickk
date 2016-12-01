Router.route('/games', {
  name: 'games',
  template: 'games',

  waitOn: function() {
    var today = parseInt(moment().dayOfYear())
    return [
      Meteor.subscribe('activeGames', today)
    ]
  },
  data: function () {
    return {
      games: Games.find().fetch()
    }
  }
});

Router.route('/games/:day', {
  name: 'different-day-games',
  template: 'games',

  waitOn: function() {
    var day = parseInt(this.params.day)
    return [
      Meteor.subscribe('activeGames', day)
    ]
  },
  data: function () {
    return {
      games: Games.find().fetch()
    }
  }
});

Router.route('/game/:_id/:period', {
  name: 'game.show',
  template: 'singleGame',
  layoutTemplate: 'homeLayout',
  waitOn: function () {
    var userId = Meteor.userId();
    var gameId = this.params._id
    var period = parseInt(this.params.period)

    return [
      Meteor.subscribe('userData'),
      Meteor.subscribe('gamePlayed', userId, gameId, period),
      Meteor.subscribe('singleGame', gameId),
      Meteor.subscribe('activeQuestions', gameId, period),
      Meteor.subscribe('activeCommQuestions', gameId, period),
      Meteor.subscribe('activePropQuestions', gameId, period),
      Meteor.subscribe('gameNotifications', gameId, userId),
      Meteor.subscribe('leaderboardGamePlayed', gameId, period, 5)
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
