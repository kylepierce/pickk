// Template.home.rendered = function() {
//     console.log(this.data); // you should see your passage object in the console
// };

// Template.eventQuestion.rendered = function() {
//     console.log(this.data); // you should see your passage object in the console
// };

// Template.option.rendered = function() {
//     console.log(this.data); // you should see your passage object in the console
// };


Template.home.helpers({
  games: function () {
    return Games.find({}).fetch();
  },
  questions: function () {
    return Questions.find({}, {limit: 1}).fetch()
  },
  gameCoins: function () {
    return GamePlayed.findOne().coins;
  }
});

Template.singleQuestion.helpers({
  eventQuestions: function (q) {
    if(q.atBatQuestion || q.event){
      return true
    }
  },
  commericalQuestions: function (q){
    if(q.commercial === true ){
      return true
    }
  },
  liveQuestion: function (q) {
    if(!q.atBatQuestion && !q.binaryChoice){
      return true
    }
  }
});

Template.eventQuestion.helpers({
  options: function (q) {
    var imported = q
    var data = this.q.options
    var keys = _.keys(data)
    var values = _.values(data)
    var optionsArray = []

    // I want to end up with a array of objects
    // [{number: option1}, {title: Run}, {multiplier: 2.43}]
    // So that o.number = option1

    for (var i = 0; i < keys.length; i++) {
      var obj = values[i]
      var number = keys[i]
      obj["option"] = number 
      optionsArray.push(obj)
    }

    return optionsArray
  }
});

Template.option.helpers({
  hasIcon: function (title) {
    var baseball = ["out", "single", "double", "triple", "homerun", "walk", "strike", "ball", "foul ball", "hit"]
    if (baseball.indexOf(title)){
      return title
    }
  }
});

Template.wagers.helpers({
  wagers: function () {
    var wagerArray = [50, 100, 250, 500, 1000, 2500]
    return wagerArray
  }
});


Template.singleQuestion.events({
  'click [data-action=play-selected]': function (e, t) {
    // console.log(this, e, t)
    $(e.currentTarget).addClass('selected')
    var displayOptions = function ( o ) {
      // The select item dom and data
      var $selected = $(e.currentTarget)
      var selectedObj = o.dataPath
      var templateName = o.insertedTemplate
      // console.log($selected, selectedObj, templateName)

      var addOptions = function ( id, data ){
        var options = "<div id='" + id + "'></div>"
        $selected.after(options);
        var container = $('#' + id + '')[0]
        Blaze.renderWithData(templateName, data, container)
      }

      var container = $('#' + o.containerId + '')[0]
      if ( container ){
        if ( container.previousSibling !== $selected[0] ){
          container.remove();
          addOptions( o.containerId, selectedObj )  
        } else {
          container.remove();
        }
      } else {
        addOptions( o.containerId, selectedObj )  
      }
    }
    parms = {
      insertedTemplate: Template.wagers,
      containerId: "wagers",
      event: e,
      template: t,
      dataPath: this,
    }
    displayOptions( parms )
  },
  'click [data-action=wager-selected]': function (e, t) {
    // console.log(this, e, t)    
    $(e.currentTarget).addClass('selected')
    var displayOptions = function ( o ) {
      // The select item dom and data
      var $selected = $(e.currentTarget)
      var selectedObj = o.dataPath
      var templateName = o.insertedTemplate
      // console.log($selected, selectedObj, templateName)

      var addOptions = function ( id, data ){
        var options = "<div id='" + id + "'></div>"
        $('.wagers').after(options);
        var container = $('#' + id + '')[0]
        Blaze.renderWithData(templateName, data, container)
      }

      var container = $('#' + o.containerId + '')[0]
      if ( container ){
        if ( container.previousSibling !== $selected[0] ){
          container.remove();
          addOptions( o.containerId, selectedObj )  
        } else {
          container.remove();
        }
      } else {
        addOptions( o.containerId, selectedObj )  
      }
    }
    parms = {
      insertedTemplate: Template.submitButton,
      containerId: "submit",
      event: e,
      template: t,
      dataPath: this,
    }
    displayOptions( parms )
  }
});

Template.submitButton.helpers({
  'live': function() {
    var connection = Meteor.status()
    var status = connection.status

    if (status == "connected") {
      return true
    } else {
      return false
    }
  },
  'potential': function (){
    var wager = this.w
    var multiplier = this.o.multiplier
    var winnings = parseInt(wager * multiplier)
    return winnings
  }
});

Template.submitButton.events({
  "click [data-action='submit']": function (e, t) {
    e.preventDefault()
    var w = this.w
    var o = this.o
    var q = this.q
    var t = this.t
    var userId = Meteor.userId()
    var userCoins = GamePlayed.find({userId: userId, gameId: q.gameId}).fetch();
    var hasEnoughCoins = userCoins[0].coins >= w
    
    var c = {
      userId: userId,
      gameId: q.gameId,
      questionId: q._id,
      type: t,
      answered: o.option,
      wager: w,
      multiplier: o.multiplier,
      description: o.title
    }

    analytics.track("question answered", {
      id: c.userId,
      answered: c.answered,
      type: c.type,
      gameId: c.gameId,
      wager: w,
    });

    if (!hasEnoughCoins) {
      IonLoading.show({
        customTemplate: '<h3>Not enough coins :(</h3><p>Lower the amount or or wait until the commercial for free pickks!</p>',
        duration: 1500,
        backdrop: true
      });
    } else {
      $(".container-item").removeClass("slideInLeft")
      $(".container-item").addClass("slideOutRight")

      Session.set('lastId', q._id);
      Session.set('lastAnswer', o.option);
      Session.set('lastWager', w);
      Session.set('lastDescription', o.title);

      var countdown = new ReactiveCountdown(360);
      countdown.start(function() {
        Meteor.call('playerInactive', c.userId, c.questionId);
      })

      setTimeout(function() {
        Meteor.call('questionAnswered', c);
      }, 250);
    }
  }
});

// Template.playerCard.helpers({
//   playerInfo: function () {
//     var playerAtBat = AtBat.findOne({active: true})
//     var playerId = playerAtBat.playerId
//     var player = Players.findOne({_id: playerId})
//     return player
//   }
// });

// Template.sAlert.events({
//   'click [data-action="shareResult"]': function() {
//     var message = Session.get("shareMessage");
//     var groupId = Session.get('chatGroup')
//     var currentUser = Meteor.userId();
//     sAlert.closeAll();
//     IonLoading.show({
//       customTemplate: '<h3>Shared in Chat!</h3>',
//       duration: 1500,
//       backdrop: true
//     })
//     Meteor.call('addChatMessage', currentUser, message, groupId);
//   }
// });

// Template.submitButton.rendered = function() {
//   if (!this._rendered) {
//     this._rendered = true;
//     var checked = $("input:checked")
//     if (checked.length > 1) {
//       // Checkout this sexy daisy chain ;)
//       var answer = $('input:radio[name=play]:checked').siblings().children()[2].id
//       answer = parseFloat(answer)
//       var wager = $('input:radio[name=wager]:checked').val();
//       var combined = parseInt(answer * wager)
//       $('#wager').checked
//       $("#submit-response").prop('value', 'Submit ( Potential Winnings: ' + combined + " )");
//       $("#submit-response").prop("disabled", false)
//       $("#submit-response").addClass('button-balanced');
//       return true
//     }

//   }
// }

// Template.binarySubmitButton.rendered = function() {
//   if (!this._rendered) {
//     this._rendered = true;
//     var checked = $("input:checked")
//     if (checked.length > 1) {
//       // Checkout this sexy daisy chain ;)
//       var answer = $('input:radio[name=binary]:checked').siblings().children()[2].id
//       answer = parseFloat(answer)
//       var wager = $('input:radio[name=wager]:checked').val();
//       var combined = parseInt(answer * wager)
//       $('#wager').checked
//       $("#submit-response").prop('value', 'Submit ( Potential Winnings: ' + combined + " )");
//       $("#submit-response").prop("disabled", false)
//       $("#submit-response").addClass('button-balanced');
//       return true
//     }

//   }
// }

// Template.binarySubmitButton.helpers({
//   'live': function() {
//     var connection = Meteor.status()
//     var status = connection.status

//     if (status == "connected") {
//       return true
//     } else {
//       return false
//     }
//   }
// });

// Template.activeQuestion.events({
//   'click [name=play]': function(event, template) {
//     var otherSelected = $('.wager')
//     // If a play has been selected before than remove that 
//     if (otherSelected) {
//       // Remove old
//       $('.wager').remove();
//     }
//     // Otherwise add the wager and submit button after
//     var answer = $('input:radio[name=play]:checked').parent()
//     answer.after($("<div class='wager'></div>"))
//     var selectedPlay = $('.wager')[0]
//     Blaze.render(Template.submitAndWagers, selectedPlay)
//   },
//   'click input': function(event, template) {
//     var checked = $("input:checked")
//     if (checked.length > 1) {
//       // Checkout this sexy daisy chain ;)
//       var answer = $('input:radio[name=play]:checked').siblings().children()[2].id
//       var wager = template.find('input:radio[name=wager]:checked').value;
//       var combined = parseInt(answer * wager)
//       $('#wager').checked
//       $("#submit-response").prop('value', 'Submit ( Potential Winnings: ' + combined + " )");
//       $("#submit-response").prop("disabled", false)
//       $("#submit-response").addClass('button-balanced');
//       return true
//     }
//   }
// });

// Template.commercialQuestion.events({
//   'click [name=play]': function(event, template) {
//     var otherSelected = $('.wager')
//     // If a play has been selected before than remove that 
//     if (otherSelected) {
//       // Remove old
//       $('.wager').remove();
//     }
//     // Otherwise add the wager and submit button after
//     var answer = $('input:radio[name=play]:checked').parent()
//     answer.after($("<div class='wager'></div>"))
//     var selectedPlay = $('.wager')[0]
//     Blaze.render(Template.submitAndWagers, selectedPlay)
//   },
//   'click input': function(event, template) {
//     var checked = $("input:checked")
//     if (checked.length > 1) {
//       // Checkout this sexy daisy chain ;)
//       var answer = $('input:radio[name=play]:checked').siblings().children()[1].id
//       var wager = template.find('input:radio[name=wager]:checked').value;
//       var combined = parseInt(answer * wager)
//       $('#wager').checked
//       $("#submit-response").prop('value', 'Submit ( Potential Winnings: ' + combined + " )");
//       $("#submit-response").prop("disabled", false)
//       $("#submit-response").addClass('button-balanced');
//       return true
//     }
//   }
// });

// Template.commercialQuestion.helpers({
//   'live': function() {
//     var connection = Meteor.status()
//     var status = connection.status
//     if (status == "connected") {
//       return true
//     } else {
//       return false
//     }
//   }
// });

// Template.predictionQuestions.helpers({
//   'questions': function() {
//     var currentUser = Meteor.userId();

//     return Questions.find(
//       {
//         active: true, commercial: null,
//         usersAnswered: {$nin: [currentUser]}
//       },
//       {sort: {dateCreated: 1}, limit: 1});
//   },
//   'live': function() {
//     var connection = Meteor.status()
//     var status = connection.status
//     if (status == "connected") {
//       return true
//     } else {
//       return false
//     }
//   }
// });

// Template.predictionQuestions.events({
//   'click input:radio[name=score]': function(event, template) {
//     $("#submit-response").prop("disabled", false)
//     $("#submit-response").addClass('button-balanced');
//   },

//   'submit form': function(event, template) {
//     event.preventDefault();
//     var questionId = this._id;
//     var currentUser = Meteor.userId();
//     var que = this.que;
//     var answer = template.find('input:radio[name=score]:checked').value;

//     // Move the card off screen
//     $(".container-item").removeClass("slideInLeft")
//     $(".container-item").addClass("slideOutRight")

//     // Wait until the question card has disapeared
//     Meteor.setTimeout(function() {
//       Meteor.call('gameQuestionAnswered', questionId, answer, 0, "");

//     }, 500);
//   }
// });

// Template.binaryChoice.events({
//   'click input:radio[name=binary]': function(event, template) {
//     $("#submit-binary").prop("disabled", false)
//     $("#submit-binary").addClass('button-balanced');
//   },

//   'click #submit-binary': function(event, template) {
//     var answer = template.find('input:radio[name=binary]:checked').value;
//     var currentUser = Meteor.userId();
//     var questionId = this._id;
//     var que = this.que

//     // Move the card off screen
//     $(".container-item").removeClass("slideInLeft")
//     $(".container-item").addClass("slideOutRight")

//     // Wait until the question card has disapeared
//     Meteor.setTimeout(function() {
//       Meteor.call('binaryQuestionAnswered', questionId, answer, 500, que)
//     }, 250);
//   },
// });

// Template.binaryChoice.helpers({
//   'live': function() {
//     var connection = Meteor.status()
//     var status = connection.status
//     if (status == "connected") {
//       return true
//     } else {
//       return false
//     }
//   }
// });

// Template.twoOptionQuestions.events({
//   'click [name=binary]': function(event, template) {
//     var otherSelected = $('.wager')
//     // If a play has been selected before than remove that 
//     if (otherSelected) {
//       // Remove old
//       $('.wager').remove();
//     }
//     // Otherwise add the wager and submit button after
//     var answer = $('#two-choice')
//     answer.after($("<div class='wager'></div>"))
//     var selectedPlay = $('.wager')[0]
//     Blaze.render(Template.binarySubmitAndWagers, selectedPlay)
//   },

//   'click input': function(event, template) {
//     var checked = $("input:checked")
//     if (checked.length > 1) {
//       // Checkout this sexy daisy chain ;)
//       var answer = $('input:radio[name=binary]:checked').siblings().children()[0].id
//       var wager = template.find('input:radio[name=wager]:checked').value;
//       var combined = parseInt(answer * wager)
//       $('#wager').checked
//       $("#submit-binary").prop('value', 'Submit ( Potential Winnings: ' + combined + " )");
//       $("#submit-binary").prop("disabled", false)
//       $("#submit-binary").addClass('button-balanced');
//       return true
//     }
//   },


//   'click #submit-binary': function(event, template) {
//     var answer = template.find('input:radio[name=binary]:checked').value;
//     var currentUser = Meteor.userId();
//     var questionId = template.data._id;
//     var que = template.data.que
//     var wager = template.find('input:radio[name=wager]:checked').value;

//     // Move the card off screen
//     $(".container-item").removeClass("slideInLeft")
//     $(".container-item").addClass("slideOutRight")

//     // Wait until the question card has disapeared
//     Meteor.setTimeout(function() {
//       Meteor.call('twoOptionQuestionAnswered', questionId, answer, wager, que)
//     }, 250);
//   },
// });

// Template.twoOptionQuestions.helpers({
//   'live': function() {
//     var connection = Meteor.status()
//     var status = connection.status

//     if (status == "connected") {
//       return true
//     } else {
//       return false
//     }
//   }
// });


// Template.wagers.rendered = function() {
//   if (!this._rendered) {
//     this._rendered = true;
//     var previousWager = Session.get("lastWager");
//     if (previousWager) {
//       document.getElementById(previousWager).checked = true
//     }
//   }
// }

// Template.wagers.events({
//   'click input[name=wager]': function(event, template) {
//     var wager = this
//   }
// });

// Template.gameBar.helpers({
//   top: function() {
//     var currentGame = Games.findOne({live: true});
//     var inningPosition = currentGame.topOfInning
//     if(inningPosition){
//       return true
//     } else {
//       return false
//     }
//   },
//   inning: function() {
//     var currentGame = Games.findOne({live: true});
//     return currentGame.inning
//   },
//   strikes: function() {
//     var currentAtBat = AtBat.findOne({active: true});
//     return currentAtBat.strikeCount
//   },
//   balls: function() {
//     var currentAtBat = AtBat.findOne({active: true});
//     return currentAtBat.ballCount
//   },
//   // outs: function ( ) {
//   //   var currentGame = Games.findOne({live: true});
//   //   return currentGame.outs
//   // },
//   first: function() {
//     var currentGame = Games.findOne({live: true});
//     //  
//     var first = currentGame.playersOnBase.first
//     if (first) {
//       return true
//     } else {
//       return false
//     }
//   },
//   second: function() {
//     var currentGame = Games.findOne({live: true});
//     // 
//     var second = currentGame.playersOnBase.second
//     if (second) {
//       return true
//     } else {
//       return false
//     }
//   },
//   third: function() {
//     var currentGame = Games.findOne({live: true});
//     // 
//     var third = currentGame.playersOnBase.third
//     if (third) {
//       return true
//     } else {
//       return false
//     }
//   },
//   inning: function() {
//     var currentGame = Games.findOne({live: true});
//     return currentGame.inning
//   },
//   oneOut: function() {
//     var currentGame = Games.findOne({live: true});
//     var outs = currentGame.outs
//     if (outs >= 1) {
//       return true
//     }
//   },
//   twoOuts: function() {
//     var currentGame = Games.findOne({live: true});
//     var outs = currentGame.outs
//     if (outs >= 2) {
//       return true
//     }
//   },
//   threeOuts: function() {
//     var currentGame = Games.findOne({live: true});
//     var outs = currentGame.outs
//     if (outs >= 3) {
//       return true
//     }
//   },
//   outs: function() {
//     var currentGame = Games.findOne({live: true});
//     return currentGame.outs
//   }
// });

// Template.normalPlay.helpers({
//   option6Exists: function() {
//     var option6 = this.options.option6
//     if (option6) {
//       return true
//     }
//   },
//   option5Exists: function() {
//     var option5 = this.options.option5
//     if (option5) {
//       return true
//     }
//   }
// });

// Template.withoutIcons.helpers({
//   option6Exists: function() {
//     var option6 = this.options.option6
//     if (option6) {
//       return true
//     }
//   },
//   option5Exists: function() {
//     var option5 = this.options.option5
//     if (option5) {
//       return true
//     }
//   }
// });


