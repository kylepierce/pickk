// Template.joinGame.onCreated(function() {
//   $(".loader-holder").delay(500).fadeOut('slow', function () {
//     $(".loading-wrapper").fadeIn('slow');
//   });
// });
//
// Template.joinGame.rendered = function () {
//
// };
//
// Template.joinGame.helpers({
//   background: function() {
//     var game = this.game[0]
// 		if (game.sport === "NFL"){
// 			return "background: linear-gradient(rgba(34, 44, 49, .0), rgba(34, 44, 49, .5)), url('/join-football-game.png'); height: 100%; background-position-x: 46%; background-position-y: 100%; "
// 		} else if (game.sport === "MLB") {
//       return "background: linear-gradient(rgba(34, 44, 49, .0), rgba(34, 44, 49, .5)), url('/baseball-background.png'); height: 100%; background-position-x: 46%; background-position-y: 100%; "
//     }
//   },
//   gameAbbr: function(){
//     var game = Games.findOne();
//     if (game) {
//       var team1 = game.home.abbreviation.toUpperCase()
//       var team2 = game.away.abbreviation.toUpperCase()
//       var output = team1 + " vs " + team2
//       return output
//     }
//   },
//   notAlreadyJoined: function (){
//     var $gameId = Router.current().params._id
//     var userId = Meteor.userId();
//     var game = Games.findOne();
//     var period = game.period
//
//     Meteor.subscribe('joinGameCount', game._id, userId, period)
//     var count = Counts.get('joinGameCount');
//     if (count === 1){
//       Router.go('game.show', {_id: $gameId});
//     } else {
//       return true
//     }
//   }
// });
//
// Template.joinGame.events({
//
// });
