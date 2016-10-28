Router.route('/games', {
  name: 'games',
  template: 'games',
  
  waitOn: function() {
    var today = parseInt(moment().dayOfYear())
    return [
      Meteor.subscribe('activeGames', 1, today),
      Meteor.subscribe('teams')
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
      Meteor.subscribe('activeGames', 1, day),
      Meteor.subscribe('teams')
    ]
  },
  data: function () {
    return {
      games: Games.find().fetch()
    }
  }
});

Router.route('/game/:_id', {
  name: 'game.show',
  template: 'singleGame',
  layoutTemplate: 'homeLayout',
  waitOn: function () {
    var userId = Meteor.userId();
    var gameId = this.params._id
    return [
      Meteor.subscribe('gamePlayed', userId, gameId),
      Meteor.subscribe('singleGame', gameId),
      Meteor.subscribe('activeQuestions', gameId),
      Meteor.subscribe('activeCommQuestions', gameId),
      Meteor.subscribe('atBatPlayer', gameId),
      Meteor.subscribe('gameNotifications', gameId, userId),
      Meteor.subscribe('leaderboardGamePlayed', gameId, 5),
      Meteor.subscribe('teams'),
    ]
  },
  data: function () {
    return {
      game: Games.find({_id: this.params._id }).fetch(),
      coins: GamePlayed.find({}).fetch()
    }   
  },
  onBeforeAction: function(){
    Meteor.call('userJoinsAGame', Meteor.userId(), this.params._id);
    Session.set('GamePlayed', this.params._id);
    return this.next();
  }
});