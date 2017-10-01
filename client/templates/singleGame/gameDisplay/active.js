Template.activeGame.onCreated(function() {
	var gameId = this.data.game._id
	var game = Games.findOne({_id: gameId});
	var data = {
		gameId: game._id,
		period: game.period,
		number: 3
	}
	Session.set('leaderboardData', data);
	
	var self = this
	self.autorun(function(){
		self.subscribe('userQuestions', self.data.game._id, game.commercial, game.period);
	})
});

Template.activeGame.helpers({
	userHasntJoined: function (){
		var userId = Meteor.userId();
		var game = Games.findOne();
		var period = game.period
		Meteor.subscribe('joinGameCount', game._id, userId, period)
		var count = Counts.get('joinGameCount');
		if (count === 0){
			return true
		}
	},
	anyQuestions: function(){
		var currentUserId = Meteor.userId();
		var game = Games.findOne();
		var gamePlayed = GamePlayed.findOne({period: game.period})
		Meteor.subscribe('userQuestions', game._id, game.commercial, game.period);
		var gameType = gamePlayed.type
		var selector = {
			active: true,
			usersAnswered: {$nin: [currentUserId]}
		}

		if (gameType == "live" && game.commercial === false){
			var finish = Chronos.moment().subtract(gamePlayed.timeLimit, "seconds").toDate();
			selector.dateCreated = {$gt: finish}
			selector.commercial = false

		} else if (gameType === "atbat" && game.commercial === false){
			var finish = Chronos.moment().subtract(gamePlayed.timeLimit, "seconds").toDate();
			selector.dateCreated = {$gt: finish}
			selector.commercial = false
		} else if (game.commercial === true){
			selector.commercial = true
		}
		// console.log(selector);
		var count = Questions.find(selector).count();

		if (count > 0){
			$('#waiting-for-play').hide();
			return true
		} else {
			$('#waiting-for-play').show();
			return false
		}
	},
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
		var gamePlayed = GamePlayed.findOne({period: game.period})
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
