// Template.home.rendered = function() {
//     console.log(this.data); // you should see your passage object in the console
// };

Template.home.onCreated(function () {
  this.coinsVar = new ReactiveVar(0);
  this.diamondsVar = new ReactiveVar(0);
});

Template.home.rendered = function() {
  let self = this;

  // Logic to increment / decrement animate coics
  this.coinsVar.set(parseInt(GamePlayed.findOne().coins));
  this.coinsFinal = 0;
  this.coinsCurrent = 0;
  this.coinsDifference = 0;


  self.autorun(function() {
    self.coinsFinal = parseInt(GamePlayed.findOne().coins);
    var startCount;

    // If coinsVar is read inside Autorun and then changes, it would go in an infinite loop. Hence, 'nonreactive'
    Tracker.nonreactive(function(){
      self.coinsCurrent = self.coinsVar.get();
      startCount = self.coinsVar.get();
    }); 

    self.coinsDifference = self.coinsFinal - self.coinsCurrent;

    if (self.coinsDifference !== 0) {
      // Start interval which changes the numbers with some delay (currently set to 20 miliseconds)
      let interval = Meteor.setInterval(function () {
          if (self.coinsDifference < 0) {
            if (startCount - self.coinsCurrent === 1000 && Math.abs(self.coinsDifference) > 5000 ) {
              self.coinsCurrent = self.coinsFinal+1000;
            }

            self.coinsVar.set(--self.coinsCurrent);
          } else {
            if (self.coinsCurrent - startCount === 1000 && Math.abs(self.coinsDifference) > 5000 ) {
              self.coinsCurrent = self.coinsFinal-1000;
            }

            self.coinsVar.set(++self.coinsCurrent);
          }

          if (self.coinsCurrent === self.coinsFinal) {
            Meteor.clearInterval(interval); // Stop the interval
          }
        }, 1);
    }
  });

  // Logic to increment / decrement animate diamonds
  if (Meteor.user()) {
    self.diamondsVar.set(parseInt(Meteor.user().profile.diamonds));

    self.diamondsFinal = 0;
    self.diamondsCurrent = 0;
    self.diamondsDifference = 0;

    self.autorun(function() {
      self.diamondsFinal = parseInt(Meteor.user().profile.diamonds);

      Tracker.nonreactive(function(){
        self.diamondsCurrent = self.diamondsVar.get();
      }); 

      self.diamondsDifference = self.diamondsFinal - self.diamondsCurrent;

      if (self.diamondsDifference !== 0) {
        // Start interval which changes the numbers with some delay (currently set to 20 miliseconds)
        var interval = Meteor.setInterval(function () {
            if (self.diamondsDifference < 0) {
              self.diamondsVar.set(--self.diamondsCurrent);
            } else {
              self.diamondsVar.set(++self.diamondsCurrent);
            }

            if (self.diamondsCurrent === self.diamondsFinal) {
              Meteor.clearInterval(interval); // Stop the interval
            }
          }, 1);
      }
    });
  }

  $('#notification-center').slick({
    arrows: false,
    infinite: false,
    draggable: true,
    centerMode: true,
    centerPadding: '4.5%'
  });
};

Template.home.helpers({
  gameInfo: function () {
    return Games.find({}).fetch();
  },
  games: function () {
    return Games.find({}).fetch();
  },
  gameCoins: function () {
    return Template.instance().coinsVar.get();
  },
  diamonds: function () {
    return Template.instance().diamondsVar.get();
    return GamePlayed.findOne().coins;
  },
  notifications: function () {
    return Notifications.find({}).fetch();
  },
  player: function () {
    return AtBat.findOne()
  },
  isCommercial: function (){
    var isCommerical = Games.findOne().commercial;
    if (isCommerical) {
      console.log("Commerical is active")
      return true
    } 
  },
  commericalQuestions: function () {
    return Questions.find({commercial: true}, {limit: 1}).fetch();
  },
  questions: function () {
    return Questions.find({}, {limit: 1}).fetch();
  },
});

Template.commericalQuestion.helpers({
  binary: function (q) {
    console.log(this, q)
    if(q.binaryChoice === true){
      return true
    }
  }
});

Template.commericalQuestion.events({
  'click [data-action=pickk]': function (e, t) {
    // console.log(this, e, t)    
    $('.play-selected').removeClass('play-selected')
    $(e.currentTarget).addClass('play-selected')
    var displayOptions = function ( o ) {
      // The select item dom and data
      var $selected = $(e.currentTarget)
      var selectedObj = o.dataPath
      var templateName = o.insertedTemplate
      console.log($selected, selectedObj, templateName)

      var addOptions = function ( id, data ){
        var options = "<div id='" + id + "'></div>"
        $('#binaryOptions').after(options);
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

Template.singleQuestion.helpers({
  eventQuestions: function (q) {
    if(q.atBatQuestion || q.event){
      return true
    }
  },
  liveQuestion: function (q) {
    var isCommerical = Games.findOne().commercial;
    var atBatQuestion = q && q.atBatQuestion
    var binaryChoice = q && q.binaryChoice
    if(!isCommerical && !atBatQuestion && !binaryChoice){
      return true
    }
  }
});
 
Template.singleQuestion.events({
  'click [data-action=play-selected]': function (e, t) {
    // console.log(this, e, t)
    $('.play-selected').removeClass('play-selected ten-spacing')
    $(e.currentTarget).addClass('play-selected ten-spacing')
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
    $('.wager-selected').removeClass('wager-selected')
    $(e.currentTarget).addClass('wager-selected')
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
  },
});

Template.eventQuestion.helpers({
  options: function (q) {
    var imported = q
    var data = this.q.options
    var keys = _.keys(data)
    var values = _.values(data)
    var optionsArray = []

    // [{number: option1}, {title: Run}, {multiplier: 2.43}]

    for (var i = 0; i < keys.length; i++) {
      var obj = values[i]
      var number = keys[i]
      obj["option"] = number 
      optionsArray.push(obj)
    }

    return optionsArray
  }
});

Template.binaryQuestion.helpers({
  options: function (q) {
    var imported = q
    var data = this.q.options
    var keys = _.keys(data)
    var values = _.values(data)
    var optionsArray = []

    // [{number: option1}, {title: Run}, {multiplier: 2.43}]

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
    if (baseball.indexOf(title) !== -1){
      return true
    }
  }
});

Template.wagers.helpers({
  wagers: function () {
    var wagerArray = [50, 100, 250, 500, 1000, 2500]
    return wagerArray
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
    var w = this.w // wager
    var o = this.o // option
    var q = this.q // question
    var t = this.t // type
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

      // var countdown = new ReactiveCountdown(360);
      // countdown.start(function() {
      //   Meteor.call('playerInactive', c.userId, c.questionId);
      // })

      setTimeout(function() {
        Meteor.call('questionAnswered', c);
      }, 250);
    }
  }
});

Template.playerCard.helpers({
  playerInfo: function () {
    var playerAtBat = AtBat.findOne({active: true})
    var playerId = playerAtBat.playerId
    var player = Players.findOne({_id: playerId})
    return player
  }
});
