Template.activeGame.helpers({
	admin: function(){
		if (Meteor.user().profile.role === "admin"){
			return true
		}
	},
	anyQuestions: function(){
		var currentUserId = Meteor.userId();
		var game = Games.findOne();
		var gamePlayed = GamePlayed.findOne();
		var gameType = gamePlayed.type
		var selector = {
			active: true,
			usersAnswered: {$nin: [currentUserId]}
		}

		if (gameType == "live" && game.commercial === false){
			var finish = Chronos.moment().subtract(gamePlayed.timeLimit, "seconds").toDate();
			selector.dateCreated = {$gt: finish}

		} else if (gameType === "atbat" && game.commercial === false){
			var finish = Chronos.moment().subtract(gamePlayed.timeLimit, "seconds").toDate();
			selector.dateCreated = {$gt: finish}
		}
		Meteor.subscribe('userQuestions', game._id, game.commercial);
		var count = Questions.find(selector).count();
		if (count > 0){
			$('#waiting-for-play').hide();
			return true
		} else {
			$('#waiting-for-play').show();
			return false
		}
	}
});

Template.liveGame.helpers({
	questionTypeIs: function(typeLooking, questionType) {
		if(typeLooking === questionType){
			return true
		}
	},
  commericalQuestions: function () {
		var game = Games.findOne({});
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
