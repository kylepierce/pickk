Template.home.rendered = function () {
  $('#notification-center').slick({
    arrows: false,
    infinite: false,
    draggable: true,
    centerMode: true,
    centerPadding: '4.5%'
  });
};

Template.home.helpers({
  games: function () {
    var $game = Router.current().params.id
    return Games.find({_id: $game}).fetch();
  },
  notifications: function () {
    var $game = Router.current().params.id
    return Notifications.find({gameId: $game}, {sort: {dateCreated: -1}, limit: 3}).fetch();
  },
  player: function () {
    return AtBat.findOne()
  },
  gameCompleted : function () {
    var game = Games.findOne();
    if (game.live === false && game.completed === true) {
      return true 
    } 
  },
  isLive: function () {
    var game = Games.findOne();
    if (game.live === true && game.completed === false) {
      return true 
    } 
  },
  commericalBreak: function (){
    var game = Games.findOne();
    if (game.commercial === true) {
      return true
    } 
  },
  commericalQuestions: function () {
    return Questions.find({commercial: true}, {limit: 1}).fetch();
  },
  questions: function () {
    var currentUserId = Meteor.userId()
    var selector = {active: true, commercial: {$ne: true}, usersAnswered: {$nin: [currentUserId]}}
    var query = Questions.find(selector, {limit: 1}).fetch();
    return query
  },
  noQuestions: function () {
    var currentUserId = Meteor.userId()
    var game = Games.findOne();
    // Checking the game commerical status and seeing if there are any questions that are avaiable for that status.
    var selector = {
      active: true, 
      commercial: {$eq: game.commercial}, 
      usersAnswered: {$nin: [currentUserId]}
    }

    var questions = Questions.find(selector).count();
    if (questions === 0 ){
      return true
    }
  },
  scoreMessage: function() {
    var user = Meteor.userId();
    var notifications = Notifications.find({userId: user, read: false});

    notifications.forEach(function(post) {
      var id = post._id
      var message = post._id
      var questionId = post.questionId
      if (post.source === "removed"){
        Meteor.subscribe('singleQuestion', questionId)
        var question = Questions.findOne({_id: questionId});
        var title = question.que
        Meteor.call('removeNotification', id);
        sAlert.info('Play: "' + title + '" was removed here are your ' + post.value + " coins!", {effect: 'stackslide', html: true});
      } else if (post.source === "overturned"){
        Meteor.subscribe('singleQuestion', questionId)
        var question = Questions.findOne({_id: questionId});
        var title = question.que
        Meteor.call('removeNotification', id);
        sAlert.info('"' + title + '" was overturned. ' + post.value + " coins were removed", {effect: 'stackslide', html: true});
      } else if (post.type === "coins" && post.read === false) {
        Meteor.subscribe('singleQuestion', questionId)
        var question = Questions.findOne({_id: questionId});
        var title = question.que

        Meteor.call('removeNotification', id);
        sAlert.info("You Won " + post.value + " coins! " + title, {effect: 'stackslide', html: true});
      } else if (post.type === "diamonds" && post.read === false) {
        message = '<img style="height: 40px;" src="/diamonds.png"> <p class="diamond"> ' + post.message + '</p>'
        Meteor.call('removeNotification', id);

        sAlert.warning(message, {effect: 'stackslide', html: true});

      } else if (post.tag == "leader") {
        IonPopup.show({
          title: 'Leaderboard Winnings!',
          template: message,
          buttons: [{
            text: 'Got It!',
            type: 'button-positive',
            onTap: function() {
              Meteor.call('removeNotification', id);
              $('body').removeClass('popup-open');
              $('.backdrop').remove();
              Blaze.remove(this.view);
            }
          }]
        });
      } else if (post.source == "Exchange") {
        message = '<img style="max-width:100%;" src="/storeowner.png">' + message
        IonPopup.show({
          title: 'Diamond Exchange',
          template: message,
          buttons: [{
            text: 'Got It!',
            type: 'button-positive',
            onTap: function() {
              Meteor.call('removeNotification', id);
              $('body').removeClass('popup-open');
              $('.backdrop').remove();
              Blaze.remove(this.view);
            }
          }]
        });
      }
    });
  }
});

Template.home.events({
  'click [data-action=game-leaderboard]': function(event, template){
    var $game = Router.current().params.id
    var userId = Meteor.userId()
    analytics.track("waiting-leaderboard", {
      userId: userId,
      gameId: $game,
    });
    Router.go('/leaderboard/'+ $game)
  },
  'click [data-action=previous-answers]': function(event, template){
    var $game = Router.current().params.id
    var userId = Meteor.userId()
    analytics.track("waiting-history", {
      userId: userId,
      gameId: $game,
    });
    Router.go('/history/'+ $game)
  }, 
  'click [data-action=notifications]': function(event, template){
    var $game = Router.current().params.id
    var userId = Meteor.userId()
    analytics.track("waiting-notifications", {
      userId: userId,
      gameId: $game,
    });
    Router.go('/notifications')
  },
  'click [data-action=chat]': function(event, template){
    var $game = Router.current().params.id
    var userId = Meteor.userId()
    analytics.track("waiting-chat", {
      userId: userId,
      gameId: $game,
    });
  }, 
  'click [data-action=play-selected]': function (e, t) {
    $('.play-selected').removeClass('play-selected ten-spacing')
    $(e.currentTarget).addClass('play-selected ten-spacing')
    var displayOptions = function ( o ) {
      // The select item dom and data
      var $selected = $(e.currentTarget)
      var selectedObj = o.dataPath
      var templateName = o.insertedTemplate

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
    $('.wager-selected').removeClass('wager-selected')
    $(e.currentTarget).addClass('wager-selected')
    Session.set('lastWager', this.w);
    var displayOptions = function ( o ) {
      // The select item dom and data
      var $selected = $(e.currentTarget)
      var selectedObj = o.dataPath
      var templateName = o.insertedTemplate

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

Template.singleGameAwards.helpers({
  gameCoins: function () {
    var userId = Meteor.userId();
    var $game = Router.current().params.id
    return GamePlayed.findOne({userId: userId, gameId: $game}).coins;
  },
  diamonds: function () {
    var userId = Meteor.userId();
    var $game = Router.current().params.id
    return GamePlayed.findOne({userId: userId, gameId: $game}).diamonds;
  },
});

Template.commericalQuestion.helpers({
  binary: function (q) {
    if(q.binaryChoice === true){
      return true
    }
  }
});

Template.commericalQuestion.events({
  'click [data-action=pickk]': function (e, t) { 
    $('.play-selected').removeClass('play-selected')
    $(e.currentTarget).addClass('play-selected')
    var displayOptions = function ( o ) {
      // The select item dom and data
      var $selected = $(e.currentTarget)
      var selectedObj = o.dataPath
      var templateName = o.insertedTemplate

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
    var prediction = q && q.type === "prediction"
    if(!isCommerical && !atBatQuestion && !binaryChoice && !prediction){
      return true
    }
  },
  dailyPickk: function (q) {
    if(q.type === "prediction"){
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
  hasIcon: function (q) {
    if (q.icons){
      return true
    }
    // var baseball = ["out", "single", "double", "triple", "homerun", "walk", "strike", "ball", "foul ball", "hit"]
    // if (baseball.indexOf(title) !== -1){
    //   return true
    // }
  }
});

Template.wagers.rendered = function () {
  var wagerArray = [50, 500, 2500]
  var lastWager = Session.get('lastWager');
  var position = wagerArray.indexOf(lastWager)
  var wager = $('[value=' + lastWager + ']' ).click();
};


Template.wagers.helpers({
  wagers: function () {
    var wagerArray = [50, 500, 2500]
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
    var multiplier = this.o.multiplier
    if(this.t === "prediction"){
      var wager = 5
      var winnings = parseInt(wager * multiplier)
      return winnings + " diamonds"
    } else {
      var wager = this.w
      var winnings = parseInt(wager * multiplier)
      return winnings
    }
  }
});

Template.submitButton.events({
  "click [data-action='submit']": function (e, t) {
    e.preventDefault()
    var userId = Meteor.userId()
    var o = this.o // option
    var q = this.q // question
    var t = this.t // type

    // a is for answer object
    var a = {
      userId: userId,
      gameId: q.gameId,
      questionId: q._id,
      type: t,
      answered: o.option,
      multiplier: o.multiplier,
      description: o.title
    }

    // Track what types of questions people are answering
    if(o.multiplier < 2.5){
      var multiplierRange = "low"
    } else if (o.multiplier < 4.5){
      var multiplierRange = "med"
    } else if (o.multiplier < 10){
      var multiplierRange = "high"
    } else if (o.multiplier < 99){
      var multiplierRange = "game changer"
    }

    if ( t === "free-pickk" ){
      var w = this.w // wager
      console.log("Free Pickk")
      a.wager = w
    } else if ( t === "prediction" ){
      var w = "diamonds" // wager
      console.log(userId, q.gameId)
      Meteor.call('userJoinsAGame', userId, q.gameId);
      console.log("Daily Pickk")
    } else {
      var w = this.w // wager
      
      // Normal Questions (i.e live, at bat, and drive)
      var selector = {userId: userId, gameId: q.gameId}
      var userCoins = GamePlayed.find(selector).fetch();
      var hasEnoughCoins = userCoins[0].coins >= w

      // Make sure the user has enough coins
      if (!hasEnoughCoins) {
        analytics.track("no coins", {
          id: a.userId,
          answered: a.answered,
          type: a.type,
          gameId: a.gameId,
          multiplier: o.multiplier,
          multiplierRange: multiplierRange,
          wager: w,
          userCoins: userCoins
        });

        IonLoading.show({
          customTemplate: '<h3>Not enough coins :(</h3><p>Lower the amount or or wait until the commercial for free pickks!</p>',
          duration: 1500,
          backdrop: true
        });
        return

      } else {
        // If they do add the wager to the answer object and set the last wager to whatever they predicted.
        a.wager = w
        Session.set('lastWager', w);
      }
    }

    // Remove the question from screen
    $(".single-question").removeClass("slideInLeft")
    $(".single-question").addClass("slideOutRight")

    analytics.track("question answered", {
      id: a.userId,
      answered: a.answered,
      type: a.type,
      gameId: a.gameId,
      multiplier: o.multiplier,
      multiplierRange: multiplierRange,
      wager: w,
    });

    var countdown = new ReactiveCountdown(250);
    countdown.start(function() {
      Meteor.call('playerInactive', a.userId, a.questionId);
    });

    setTimeout(function() {
      Meteor.call('questionAnswered', a);
    }, 250);

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


// Template.home.rendered = function() {
//     console.log(this.data); // you should see your passage object in the console
// };

// Template.singleGameAwards.onCreated(function () {
//   this.coinsVar = new ReactiveVar(0);
//   this.diamondsVar = new ReactiveVar(0);
// });

// Template.singleGameAwards.rendered = function() {
//   var self = this;

//   // Logic to increment / decrement animate coics
//   this.coinsVar.set(parseInt(GamePlayed.findOne().coins));
//   this.coinsFinal = 0;
//   this.coinsCurrent = 0;
//   this.coinsDifference = 0;


//   self.autorun(function() {
//     self.coinsFinal = parseInt(GamePlayed.findOne().coins);
//     var startCount;

//     // If coinsVar is read inside Autorun and then changes, it would go in an infinite loop. Hence, 'nonreactive'
//     Tracker.nonreactive(function(){
//       self.coinsCurrent = self.coinsVar.get();
//       startCount = self.coinsVar.get();
//     }); 

//     self.coinsDifference = self.coinsFinal - self.coinsCurrent;

//     if (self.coinsDifference !== 0) {
//       // Start interval which changes the numbers with some delay (currently set to 20 miliseconds)
//       var interval = Meteor.setInterval(function () {
//           if (self.coinsDifference < 0) {
//             // if (startCount - self.coinsCurrent === 1000 && Math.abs(self.coinsDifference) > 500 ) {
//             //   self.coinsCurrent = self.coinsFinal+1000;
//             // }

//             self.coinsVar.set(--self.coinsFinal);
//             Meteor.clearInterval(interval)
//           } else {
//             if (self.coinsCurrent - startCount === 1000 && Math.abs(self.coinsDifference) > 5000 ) {
//               self.coinsCurrent = self.coinsFinal-1000;
//             }

//             self.coinsVar.set(++self.coinsCurrent);
//           }

//           if (self.coinsCurrent === self.coinsFinal) {
//             Meteor.clearInterval(interval); // Stop the interval
//           }
//         }, 1);
//     }
//   });

//   // Logic to increment / decrement animate diamonds
//   if (Meteor.user()) {
//     self.diamondsVar.set(parseInt(Meteor.user().profile.diamonds));

//     self.diamondsFinal = 0;
//     self.diamondsCurrent = 0;
//     self.diamondsDifference = 0;

//     self.autorun(function() {
//       self.diamondsFinal = parseInt(Meteor.user().profile.diamonds);

//       Tracker.nonreactive(function(){
//         self.diamondsCurrent = self.diamondsVar.get();
//       }); 

//       self.diamondsDifference = self.diamondsFinal - self.diamondsCurrent;

//       if (self.diamondsDifference !== 0) {
//         // Start interval which changes the numbers with some delay (currently set to 20 miliseconds)
//         var interval = Meteor.setInterval(function () {
//             if (self.diamondsDifference < 0) {
//               self.diamondsVar.set(--self.diamondsCurrent);
//             } else {
//               self.diamondsVar.set(++self.diamondsCurrent);
//             }

//             if (self.diamondsCurrent === self.diamondsFinal) {
//               Meteor.clearInterval(interval); // Stop the interval
//             }
//           }, 1);
//       }
//     });
//   }
// };




// Template.waitingForNextPlay.events({
//   'click [data-action=game-leaderboard]': function(event, template){
//     var $game = Router.current().params.id
//     console.log($game)
//     Router.go('/leaderboard/'+ $game)
//   },
//   'click [data-action=previous-answers]': function(event, template){
//     var $game = Router.current().params.id
//     console.log($game)
//     Router.go('/history/'+ $game)
//   }, 
// });




