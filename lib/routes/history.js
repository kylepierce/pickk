Router.route('/history', {
  template: 'history',
  fastRender: true,
  controller: 'authenticatedController',
  waitOn: function() {
    return [
      Meteor.subscribe('gamesPlayed')
    ]
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
  data: function() {
    return this.params;
  }
});