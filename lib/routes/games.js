Router.route('/games', {
  name: 'games',
  template: 'games',
  fastRender: true,
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
  fastRender: true,
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

Router.route('/game/:id', {
  name: 'game.show',
  template: 'home',
  fastRender: true,
  layoutTemplate: 'homeLayout',
  waitOn: function () {
    var user = Meteor.userId();
    var game = this.params.id
    return [
      Meteor.subscribe('gamePlayed', user, game),
      Meteor.subscribe('singleGame', game),
      Meteor.subscribe('activeQuestions', game),
      Meteor.subscribe('activeCommQuestions', game),
      Meteor.subscribe('atBatPlayer', game),
      Meteor.subscribe('gameNotifications', game, user),
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