Template.preGame.onCreated(function() {
  this.subscribe('preGamePickks', this.data.game._id);
  var data = {
    gameId: this.data.game._id,
    dateCreated: new Date(),
    userId: Meteor.userId(),
    period: 0,
  }
  Meteor.call('userJoinsAGame', data)
});

Template.preGame.helpers({
  'questionsAvailable': function(){
    var selector = {
      period: 0,
    }
    return Questions.find(selector).count();
  },
});

Template.preGameCard.helpers({
  'coins': function(){
    var userId = Meteor.userId();
    var gamePlayed = GamePlayed.findOne({userId: userId});
    return gamePlayed.coins
  },
  'questionsAvailable': function(){
    var selector = {
      period: 0,
    }
    return Questions.find(selector).count();
  },
  'questionsAnswered': function(){
    var selector = {
      period: 0,
      usersAnswered: {$in: [Meteor.userId()]}
    }
    return Questions.find(selector).count();
  }
});


Template.prePickkList.helpers({
  'preGamePickks': function(){
    var selector = {
      period: 0,
    }
    var sort = {sort: {dateCreated: 1}}
    return Questions.find(selector, sort).fetch();
  },
  'questionsAvailable': function(){
    var selector = {
      period: 0,
    }
    return Questions.find(selector).count();
  },
  'questionsAnswered': function(){
    var selector = {
      period: 0,
      usersAnswered: {$in: [Meteor.userId()]}
    }
    return Questions.find(selector).count();
  }
})

Template.prePickkList.events({
  'click': function(e, t){
    var alreadyAnswered = this.q.usersAnswered.indexOf(Meteor.userId());
    if (this.q.active && alreadyAnswered === -1){
      QuestionPopover.show('prePickkQuestion', this);
    } else {
      IonModal.open('questionDetails', this);
    }
  }
});
