Router.route('admin', {
  path: '/admin',
  template: 'admin',
  controller: 'AdminController',
  subscriptions: function(){
    return [
      Meteor.subscribe('questions'), // Remove soon
      Meteor.subscribe('activeQuestions'),
      Meteor.subscribe('activeGames'),
      Meteor.subscribe('pendingQuestions')
    ]
  }
}); 

Router.route('/admin/game/:_id', {
  template: 'singleGameAdmin',
  name: 'adminGame.show',
  controller: 'AdminController',
  waitOn: function() {
    return [
      Meteor.subscribe('singleGame', this.params._id),
      Meteor.subscribe('adminActiveQuestions', this.params._id),
      Meteor.subscribe('multiplier'),
      // Meteor.subscribe('pendingQuestions', this.params._id)
    ]
  },
  data: function () {
    return {
      questions: Questions.find({gameId: this.params._id}).fetch(),
      game: Games.find({_id: this.params._id}).fetch()
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
  fastRender: true,
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
})

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
  subscriptions: function() {
    return [
      Meteor.subscribe('gameQuestions'),
      Meteor.subscribe('pendingGameQuestions'),
    ]
  },
}); 