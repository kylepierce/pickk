Router.route('/history', {
  name: 'history',
  template: 'history',
});

// 🚨🚨🚨
Router.route('/history/:_id', {
  name: 'gameHistory.show',
  template: 'singleGameHistory',
  waitOn: function() {
    var userId = Meteor.userId();
    var gameId = this.params._id
    return [
      Meteor.subscribe('singleGame', gameId),
      Meteor.subscribe('teams')
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

Router.route('/question/:_id', {
  name: 'question.show',
  template: 'questionDetails',
  // layoutTemplate: "notificationLayout",
});
