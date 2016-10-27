Router.route('/history', {
  template: 'history',
  fastRender: true,
  waitOn: function() {
    return Meteor.subscribe('gamesPlayed')
  },
  data: function () {
    return {
      games: Games.find().fetch()
    }
  },
  onBeforeAction: function ( ) {
    return this.next();
  }
});

Router.route('/history/:_id', {
  name: 'gameHistory.show',
  template: 'singleGameHistory',
  waitOn: function() {
    var userId = Meteor.userId();
    var gameId = this.params._id
    return [
      Meteor.subscribe('singleGame', gameId),
      Meteor.subscribe('gamePlayed', userId, gameId),
      Meteor.subscribe('teams'),
    ]
  },
  data: function () {
    return {
      game: Games.find({_id: this.params._id}).fetch(),
    }
  },
  onBeforeAction: function ( ) {
    return this.next();
  }
});