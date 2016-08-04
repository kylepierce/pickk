// Template.singleGame.created = function () {
//   this.autorun(function () {
//     this.subscription = Meteor.subscribe('games', Router.current().params._id);
//   }.bind(this));
// };

// // Template.home.onRendered( function() {
// //   var w = 600;
// //   var h = 500;
// //   var padding = {top: 40, right: 40, bottom: 40, left: 40};
// //   var dataset;
// //   var stack = d3.layout.stack();

// // }

// Template.singleGame.helpers({
  
//   game: function () {
//     var game = Router.current().params._id
//     return Games.findOne({_id: Router.current().params._id});
//   },
//   question: function(){
//   	return Questions.find({gameId: Router.current().params._id}).fetch()
//   },
//   'numberOfQuestions': function(){
//     var game = Router.current().params._id
//     Meteor.subscribe('allQuestions', game)
//     var gameData = Questions.find({gameId: game}, {sort: {dateCreated: -1}}).fetch()    
//     return gameData
//   },
//   liveGame: function(){
//   	var gameData = Games.findOne({_id: Router.current().params._id}); 
//   	if(gameData.live === true){
//   		return "checked"
//   	}
//   }
// }); 
