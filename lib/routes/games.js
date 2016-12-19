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
