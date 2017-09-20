Template.preGame.onCreated(function() {
  Meteor.subscribe('preGamePickks', this.data.game._id);
  var data = {
    gameId: this.data.game._id,
    dateCreated: new Date(),
    userId: Meteor.userId(),
    period: 0,
  }
  Meteor.call('userJoinsAGame', data)
});

Template.preGame.helpers({
  'noQuestions': function(){
    var selector = {
      period: 0,
      active: true,
      usersAnswered: {$nin: [Meteor.userId()]}
    }
    count = Questions.find(selector).count();
    if (count === 0) {
      return true
    }
  },
  'preGamePickks': function(){
    var selector = {
      period: 0,
      active: true,
      usersAnswered: {$nin: [Meteor.userId()]}
    }
    var sort = {sort: {dateCreated: 1}, limit: 1}
    return Questions.find(selector, sort).fetch();
  },
  'questionsAvailable': function(){
    var selector = {
      period: 0,
      active: true
    }
    return Questions.find(selector).count();
  },
  'questionsAnswered': function(){
    var selector = {
      period: 0,
      active: true,
      usersAnswered: {$in: [Meteor.userId()]}
    }
    return Questions.find(selector).count();
  }
});
