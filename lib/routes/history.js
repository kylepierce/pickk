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

Router.route('/history/:id', {
  name: 'gameHistory.show',
  template: 'singleGameHistory',
  waitOn: function() {
    return [
      Meteor.subscribe('singleGame', this.params.id),
    ]
  },
  data: function () {
    return {
      game: Games.find({_id: this.params.id}).fetch(),
    }
  },
  onBeforeAction: function ( ) {
    return this.next();
  }
});