Router.route('/history', {
  template: 'history',
  fastRender: true,
  waitOn: function() {
    return [
      Meteor.subscribe('gamesPlayed'),
      Meteor.subscribe('userGamesPlayed')
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
  waitOn: function() {
    return [
      Meteor.subscribe('singleGame', this.params._id),
      Meteor.subscribe('questionsByGameId', this.params._id),
      Meteor.subscribe('answersByGameId', this.params._id)
    ]
  },
  data: function () {
    return {
      game: Games.find({_id: this.params._id}).fetch(),
      answers: Answers.find().fetch(),
      questions: Questions.find().fetch()
    }
  },
  onBeforeAction: function ( ) {
    return this.next();
  }
});