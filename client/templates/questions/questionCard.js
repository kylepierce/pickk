// Template.questionCard.onCreated(function() {
//   this.subscribe('lastAnswer');
// });

Template.questionCard.helpers({
  userGroups: function() {
    var currentUser = Meteor.userId();
    return Groups.find({members: currentUser}).fetch()
  },

  groups: function(){
    var currentUser = Meteor.user();
    var groupCount = currentUser.profile.groups.length 
    console.log(groupCount)
    if (groupCount){
      return true
    }
  },

  'live': function() {
    var game = Games.findOne({live: true});
    if (game && game.live == true) {
      return true
    }
  },

  gameQuestion: function() {
    var currentUser = Meteor.userId();
    var active = Questions.find(
      {
        active: true, commercial: null,
        usersAnswered: {$nin: [currentUser]}
      },
      {sort: {dateCreated: 1}}).fetch();
    if (active.length >= 1) {
      return true
    } else {
      return false
    }
  },

  'gameQuestions': function() {
    var currentUser = Meteor.userId();

    return Questions.find(
      {
        active: true, gameId: "prediction",
        usersAnswered: {$nin: [currentUser]}
      },
      {sort: {dateCreated: 1}, limit: 1});
  },

  'lastPlay': function() {
    return {
      lastAnswer: Session.get("lastAnswer"),
      lastWager: Session.get("lastWager"),
      lastDescription: Session.get("lastDescription")
    }
  },

  'activeCheck': function() {
    questionId = Session.get('lastId');
    var question = Questions.findOne({_id: questionId});
    if (question.active === true) {
      return true
    }
  },
  'connection': function() {
    var connection = Meteor.status()
    var status = connection.status
    if (status == "connected") {
      return true
    } else {
      return false
    }
  },

  'active': function(game) {
    var game = Games.findOne({live: true});
    if (game.commercial == false) {
      return true
    } else {
      return false
    }
  },

  'multiOptions': function() {
    var currentUser = Meteor.userId();
    var active = Questions.find(
      {
        active: true, commercial: false,
        usersAnswered: {$nin: [currentUser]}
      },
      {sort: {dateCreated: 1}}).fetch();
    if (active.length >= 1) {
      return true
    }
  },

  'ingameBinary': function() {
    var currentUser = Meteor.userId();
    var active = Questions.find(
      {
        active: true, commercial: false, binaryChoice: true,
        usersAnswered: {$nin: [currentUser]}
      },
      {sort: {dateCreated: 1}}).fetch();
    if (active.length >= 1) {
      var first = active[0]
      return first
    } else {
      return false
    }
  },

  'commercialQuestions': function() {

    var currentUser = Meteor.userId();
    var active = Questions.find(
      {
        active: true, commercial: true,
        usersAnswered: {$nin: [currentUser]}
      },
      {sort: {dateCreated: 1}}).fetch();
    if (active.length >= 1) {
      return true
    } else {
      return false
    }
  },
  'binary': function() {
    var currentUser = Meteor.userId();
    var active = Questions.find(
      {
        active: true, commercial: true, binaryChoice: true,
        usersAnswered: {$nin: [currentUser]}
      },
      {sort: {dateCreated: 1}}).fetch();

    if (active.length >= 1) {
      var first = active[0]
      return first
    } else {
      return false
    }
  },

  'questions': function() {
    var currentUser = Meteor.userId();

    return Questions.find(
      {
        active: true, commercial: true, binaryChoice: true,
        usersAnswered: {$nin: [currentUser]}
      },
      {sort: {dateCreated: 1}, limit: 1});
  },

  'activeQuestions': function() {
    var currentUser = Meteor.userId();
    return Questions.find(
      {
        active: true, commercial: false,
        usersAnswered: {$nin: [currentUser]}
      },
      {sort: {dateCreated: 1}, limit: 1});
  },

  'twoOption': function() {
    var currentUser = Meteor.userId();
    return Questions.find(
      {
        active: true, commercial: false, binaryChoice: true,
        usersAnswered: {$nin: [currentUser]}
      },
      {sort: {dateCreated: 1}, limit: 1});
  },

  'multiAnswerCommQuestions': function() {
    var currentUser = Meteor.userId();

    return Questions.find(
      {
        active: true, commercial: true,
        usersAnswered: {$nin: [currentUser]}
      },
      {sort: {dateCreated: 1}, limit: 1});
  },

  'commercial': function(game) {
    var game = Games.findOne({live: true});
    if (game.commercial == true) {
      return true
    }
  },
  'commercialRandom': function() {
    var random = Math.floor((Math.random() * 6) + 1)
    if (random == 1) {
      return '<p class="did-you next-play">Join the Conversation by Tapping <br> the <i class="ion-ios-chatboxes"></i> Button</p>'
    } else if (random == 2) {
      return '<p class="did-you next-play">Playing With Friends? Create a Group!</p>'
    } else if (random == 3) {
      return '<p class="did-you next-play">Follow @GetPickk on Twitter, Instagram and Facebook</p>'
    } else if (random == 4) {
      return '<p class="did-you next-play"><b>Have a question?</b><br> Check out our common questions in our side menu</p>'
    } else if (random == 5) {
      return '<p class="did-you next-play"><b>What do diamonds do?</b><br> Diamonds are how we track who performed the best in a week. Once the week is over the diamond leaders are given prizes.</p>'
    } else if (random == 6) {
      return '<p class="did-you next-play"><b>What do Coins do?</b><br> Coins are how we track who performed the best in a game. Once the game is over the coins are exchanged into diamonds.</p>'
    }

  }
});

Template.questionCard.events({
  'click input:radio[name=wager]': function(event, template) {
    var wager = template.find('input:radio[name=wager]:checked').value

    // $("#submit-response").prop("disabled", false)
    // $("#submit-response").addClass('button-balanced');
  },
  'click [data-action=no-group]': function(){
    Router.go('/groups')
  }, 
  // 'click input:radio[name=play]':function(event, template) {
  // 	play = template.find('input:radio[name=play]:checked').value
  // },

  'submit form': function(event, template) {
    event.preventDefault();
    var questionId = this._id;
    var currentUser = Meteor.userId();
    var que = this.que;
    var answer = template.find('input:radio[name=play]:checked').value;
    var wager = template.find('input:radio[name=wager]:checked').value;
    var description = template.find('input:radio[name=play]:checked').id;
    var userCoins = Meteor.user().profile.coins;

    if (userCoins < wager) {
      IonLoading.show({
        customTemplate: '<h3>Not enough coins :(</h3><p>Lower the amount or or wait until the commercial for free pickks!</p>',
        duration: 1500,
        backdrop: true
      });
    } else {
      $(".container-item").removeClass("slideInLeft")
      $(".container-item").addClass("slideOutRight")

      Session.set('lastId', questionId);
      Session.set('lastAnswer', answer);
      Session.set('lastWager', wager);
      Session.set('lastDescription', description);

      // analytics.track("userAnsweredQuestion", {
      //   id: currentUser,
      //   question: que,
      //   questionId: questionId,
      //   answer: answer,
      //   wager: wager,
      //   description: description
      // });

      var countdown = new ReactiveCountdown(360);
      countdown.start(function() {
        Meteor.call('playerInactive', currentUser, questionId);
      })

      setTimeout(function() {
        Meteor.call('questionAnswered', questionId, answer, wager, description);
      }, 250);

    }
  }
});
