Template.singleGameAwards.helpers({
  active: function(){
    var $game = Router.current().params._id
    var game = Games.findOne({_id: $game});

    var gamePlayed = GamePlayed.findOne({gameId: $game, period: game.period, userId: Meteor.userId()})
    if (game && gamePlayed){
      return true
    } else if (game && game.eventStatus.eventStatusId === 2){
       return true
    } else {
      return false
    }
  },
  gameAbbr: function(){
    var $game = Router.current().params._id
    var game = Games.findOne({_id: $game});
    if (game) {
      var team1 = game.home.abbreviation.toUpperCase()
      var team2 = game.away.abbreviation.toUpperCase()
      var output = team1 + " vs " + team2
      return output
    }
  },
  usersAward: function (award) {
    var userId = Meteor.userId();
    var $game = Router.current().params._id
    var game = Games.findOne({_id: $game});

    if (game){
      var period = game.period
      var userGamePlayed = GamePlayed.findOne({userId: userId, gameId: $game, period: period});
      if(userGamePlayed){
        return userGamePlayed[award];
      }
    }
  },
  gameType: function () {
    var userId = Meteor.userId();
    var $game = Router.current().params._id
    var game = Games.findOne({_id: $game});
    var game = GamePlayed.findOne({period: game.period})
    if(game && game.type === "proposition"){
      var type = "PROP"
      return type
    } else if (game) {
      var type = game.type.toUpperCase()
      return type
    }
  },
});

// Template.singleGame.rendered = function() {
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
