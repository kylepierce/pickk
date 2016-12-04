Template.singleGameAwards.helpers({
  gameCoins: function () {
    var userId = Meteor.userId();
    var $game = Router.current().params._id
    var game = Games.findOne({_id: $game});

    if (game && game.period){
      var game = GamePlayed.findOne({userId: userId, gameId: $game, period: game.period})
      return game.coins;
    }
  },
  diamonds: function () {
    var userId = Meteor.userId();
    var $game = Router.current().params._id
    var game = Games.findOne({_id: $game});

    if (game && game.period){
      var game = GamePlayed.findOne({userId: userId, gameId: $game, period: game.period})
      return game.diamonds;
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
