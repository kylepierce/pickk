Router.route('/games', {
  name: 'games',
  template: 'games',
  fastRender: true,
  waitOn: function() {
    return [
      Meteor.subscribe('activeGames', 1),
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
  waitOn: function () {
    var user = Meteor.userId();
    return [
      Meteor.subscribe('gamePlayed', user, this.params.id),
      Meteor.subscribe('singleGame', this.params.id),
      Meteor.subscribe('answersByGameId', this.params.id),
      Meteor.subscribe('activeQuestions', this.params.id),
      Meteor.subscribe('activeAtBat', this.params.id),
      Meteor.subscribe('atBatPlayer', this.params.id),
      Meteor.subscribe('activePlayers', this.params.id),
      Meteor.subscribe('gameNotifications', this.params.id),
      Meteor.subscribe('teams'),
    ]
  },
  data: function () {
    return {
      game: Games.find({_id: this.params.id }).fetch(),
      coins: GamePlayed.find({}).fetch()
    }   
  },
  onBeforeAction: function(){
    Meteor.call('userJoinsAGame', Meteor.userId(), this.params.id);
    Session.set('GamePlayed', this.params.id);
    return this.next();
  }
});