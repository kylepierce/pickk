Template.singleGameHistory.helpers({
	notPrediction: function () {
		var game = Games.findOne({});
		if (game.type === "prediction" || game.type === "predictions"){
			return false
		} else {
			return true
		}
	}
});

Template.gameHistory.onCreated(function(){
	var $gameId = Router.current().params._id
	this.subscribe('questionsByGameId', $gameId, this.data.number, false);
});

Template.gameHistory.helpers({
	questions: function (number){
		return Questions.find({}, {sort: {dateCreated: -1}}).fetch()
	},

});

Template.singleQuestion.helpers({
	status: function () {
		var userId = Meteor.userId()
		var answer = Answers.findOne({"questionId": this.q._id, userId: userId});
		if (this.q.outcome && answer){
			var contains = this.q.outcome.indexOf(answer.answered)
		}

		if (contains > -1) {
			return "history-correct" // Correct
		} else if (this.q.active === true){
			return "history-live" // In progress
		} else if (this.q.active === null){
			return "history-pending" // Pending
		} else {
			return "history-incorrect" // Incorrect
		}
	},
	location: function(){
		var extended = Template.parentData(2).extended
		var answerExtended = this.extended
		if (extended || answerExtended) {
			return "single-question-history-card"
		}
	},
	single: function(){
		if(this.single){
			return "hidden"
		}
	}
});

Template.singleQuestion.events({
	'click': function(){
		Router.go('/question/' + this.q._id);
	}
})

Template.questionTop.helpers({
	questionTitle: function (){
		if(this.q.que.length > 20){
			return "small-question-text"
		}
	},
	timeAgo: function(){
		var userId = Meteor.userId()
		var answer = Answers.findOne({"questionId": this.q._id, userId: userId});
		if(answer){
			var answerCreated = answer.dateCreated
			var now = new Date;
			var diff = now - answerCreated

			var timeConverter = function(time, length) {
				var timeNumber = time / length
				return parseFloat(timeNumber).toFixed(0)
			}

			if (diff < 60000) {
				var timeNumber = timeConverter(diff, 1000)
				return timeNumber + " Seconds Ago"
			} else if (diff > 60000 && diff < 3600000) {
				var timeNumber = timeConverter(diff, 60000)
				return timeNumber + " Mins Ago"
			} else if (diff > 3600000 && diff < 86400000) {
				var timeNumber = timeConverter(diff, 3600000)
				return timeNumber + " Hours Ago"
			} else if (diff > 86400000){
				var timeNumber = timeConverter(diff, 86400000)
				return timeNumber + " Days Ago"
			}
		}
	},
	details: function() {
		var extended = Template.parentData(2).extended
		var answerExtended = this.extended
		if (extended || answerExtended) {
			return true
		}
	},
	winnings: function (id){
		var userId = Meteor.userId()
		var answer = Answers.findOne({"questionId": this.q._id, userId: userId});

		addCommas = function(number){
			return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}

		if (answer){
			// var contains = outcome.indexOf(answered)
		}
		// if (contains > -1) {
		// 	return "+ " + addCommas(parseInt(this.a.wager * this.a.multiplier)) + "</strong>"
		// } else if (outcome === "Removed" || this.q.type === 'freePickk'){
		// 	return "+ " + this.a.wager
		// } else if (outcome !== undefined && answered !== outcome) {
		// 	return "- " + this.a.wager
		// }
	},
});

Template.questionBottom.helpers({
	active: function (status){
		if (status === false){
			return true
		}
	},
	answer: function(){
		var userId = Meteor.userId()
		var answer = Answers.findOne({"questionId": this.q._id, userId: userId});
		if (answer){
			return answer.answered
		} else {
			return "N/A"
		}
	},
	title: function ( option ){
		var options = this.q.options
		if (option === "Removed" || option === "deleted") {
			return "Removed"
		} else if (Array.isArray(option)) {
			var list = []
			_.map(option, function (o) {
				var selected = options[o]
				list.push(selected.title)
			});

			return list
		} else if (option === true || option === false) {
			return option
		} else if (option === undefined || option === "N/A") {
			return "Unanswered"
		}
		var selected = options[option]
		return selected.title
	},
});

Template.questionExtended.helpers({
	details: function() {
		var userId = Meteor.userId()
		var extended = Template.parentData(2).extended
		var answerExtended = this.extended
		var answer = Answers.findOne({"questionId": this.q._id, userId: userId});
		if (answer && extended || answer && answerExtended) {
			return answer
		}
	}
});
