Router.route('/admin/game/:_id/:period', {
  template: 'singleGameAdmin',
  name: 'adminGame.show',
  controller: 'AdminController',
  waitOn: function() {
    var gameId = this.params._id
    var period = parseInt(this.params.period)

    return [
      Meteor.subscribe('singleGame', gameId),
      Meteor.subscribe('multiplier'),
      Meteor.subscribe('singleGameFutureQuestions', gameId, period),
      Meteor.subscribe('singleGameActiveQuestions', gameId, period),
      Meteor.subscribe('singleGamePendingQuestions', gameId, period),
      Meteor.subscribe('singleGameOldQuestions', gameId, period),
      Meteor.subscribe('situationalQuestions')
    ]
  },
  data: function () {
    var gameId = this.params._id
    var period = parseInt(this.params.period)
    return {
      questions: Questions.find({gameId: gameId, period: period}).fetch(),
      game: Games.find({_id: gameId}).fetch()
    }
  },
  onBeforeAction: function() {
    return this.next();
  }
});

Router.route('/admin/hero', {
  template: 'insertHero',
  controller: 'AdminController',
  onBeforeAction: function() {
    return this.next();
  }
});

Router.route('/admin/betaList', {
  template: 'betaList',

  controller: 'AdminController',
  subscriptions: function(){
    return [
      Meteor.subscribe('betaList')
    ]
  }
});

Router.route('/admin/baseball', {
  template: 'adminBaseball',
  controller: 'AdminController',
  subscriptions: function(){
    return [
      Meteor.subscribe('questions'), // Remove soon
      Meteor.subscribe('activeQuestions'),
      Meteor.subscribe('pendingQuestions'),
      Meteor.subscribe('activeAtBat'),
      // Meteor.subscribe('atBatForThisGame'),
      // Meteor.subscribe('oneGamePlayers'),
      Meteor.subscribe('teams')
    ]
  }
});

Router.route('/admin/settings', {
  template: 'adminSettings',
  controller: 'AdminController',
});

Router.route('/admin/trophies',{
  template: 'trophies',
  controller: 'AdminController',
  subscriptions: function() {
    return [
      Meteor.subscribe('trophy')
    ]
  }
});

Router.route('/admin/game', {
  template: 'gameInfo',
  controller: 'AdminController',
});

Router.route('/admin/game-prediction', {
  template: 'gamePrediction',
  controller: 'AdminController',
  waitOn: function() {
    return [
      Meteor.subscribe('gameQuestions'),
      Meteor.subscribe('predictionGames')
    ]
  },
  onBeforeAction: function() {
    return this.next();
  }
});
