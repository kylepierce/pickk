Template.liveGame.helpers({
	questionTypeIs: function(typeLooking, questionType) {
		if(typeLooking === questionType){
			return true
		}
	},
  commericalQuestions: function () {
		var game = Games.findOne({});
    var gamePlayed = GamePlayed.findOne({});
		if(game && game.commercial === true){
			var selector = {
				active: true,
				commercial: true,
				usersAnswered: {$nin: [Meteor.userId()]}
			}
			var sort = {sort: {dateCreated: 1}, limit: 1}
			return Questions.find(selector, sort).fetch();
		}
  },
  questions: function () {
		var game = Games.findOne({});
    var gamePlayed = GamePlayed.findOne({});
    var gameType = gamePlayed.type
		if (gameType === "live" || gameType === "atBat"){
      var selector = {
        active: true,
        commercial: false,
        usersAnswered: {$nin: [Meteor.userId()]}
      }
      var sort = {sort: {dateCreated: 1}, limit: 1}
      return Questions.find(selector, sort).fetch();
    }
  },
});
