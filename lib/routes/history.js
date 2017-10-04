Router.route('/history', {
  template: 'history',

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
  layoutTemplate: "notificationLayout",
  waitOn: function() {
    var questionId = this.params._id
    return [
      Meteor.subscribe('questionHistory', questionId),
    ]
  },
  data: function () {
    var userId = Meteor.userId()
    return {
      question: Questions.findOne({_id: this.params._id}),
      answer: Answers.findOne({userId: userId, questionId: this.params._id}),
      questionReported: QuestionReport.findOne({userId: userId, questionId: this.params._id})
    }
  },
  onBeforeAction: function ( ) {
    return this.next();
  }
});
