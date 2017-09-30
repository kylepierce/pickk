Template.preGame.onCreated(function() {
  var data = {
    gameId: this.data.game._id,
    dateCreated: new Date(),
    userId: Meteor.userId(),
    period: 0,
  }
  Meteor.call('userJoinsAGame', data)
});

Template.preGame.onCreated(function() {
  this.subscribe('preGamePickks', this.data.game._id);
});


Template.prePickkList.helpers({
  'preGamePickks': function(){
    var selector = {
      period: 0,
      active: true
    }
    var sort = {sort: {dateCreated: 1}}
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
})

Template.prePickkList.events({
  'click': function(e, t){
    var alreadyAnswered = this.q.usersAnswered.indexOf(Meteor.userId());
    if (alreadyAnswered === -1){
      QuestionPopover.show('prePickkQuestion', this);
    } else {
      IonModal.open('questionDetails', this);
    }

  }
});
