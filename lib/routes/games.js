Router.route('/games', {
  name: 'games',
  template: 'games',
  fastRender: true,
  controller: 'authenticatedController',
  waitOn: function() {
    return [
      Meteor.subscribe('activeGames'),
      Meteor.subscribe('teams')
    ]
  },
  data: function () {
    return {
      games: Games.find().fetch()
    }
  }
});

Router.route('/game/:id', {
  name: 'game.show',
  template: 'home',
  fastRender: true,
  layoutTemplate: 'homeLayout',
  controller: 'authenticatedController',
  waitOn: function () {
    var user = Meteor.userId();
    return [
      Meteor.subscribe('gamePlayed', user, this.params.id),
      Meteor.subscribe('game', this.params.id),
      Meteor.subscribe('answersByGameId', this.params.id),
      Meteor.subscribe('activeQuestions', this.params.id),
      Meteor.subscribe('activeAtBat', this.params.id),
      Meteor.subscribe('atBatPlayer', this.params.id),
      Meteor.subscribe('activePlayers', this.params.id),
      Meteor.subscribe('teams'),
    ]
  },
  data: function () {
    return {
      game: Games.find({}).fetch()
    }   
  },
  onBeforeAction: function(){
    Meteor.call('userJoinsAGame', Meteor.userId(), this.params.id);
    Session.set('GamePlayed', this.params.id);
    return this.next();
  }
});