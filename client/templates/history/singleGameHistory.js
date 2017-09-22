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

Template.gameHistory.helpers({
	questions: function (number){
		var $gameId = Router.current().params._id
		Meteor.subscribe('questionsByGameId', $gameId, number)
		return Questions.find({}, {sort: {dateCreated: -1}}).fetch()
	},
	answers: function (id) {
		var userId = Meteor.userId()
		var answer = Answers.findOne({"questionId": id, userId: userId});
		return answer
	}
});

Template.singleAnswer.helpers({
	active: function (status){
		if (status === false){
			return true
		}
	},
	status: function () {
		if (this.q.outcome){
			var contains = this.q.outcome.indexOf(this.a.answered)
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
		if (extended) {
			return "single-question-history-card"
		}
	},
	questionTitle: function (){
		if(this.q.que.length > 20){
			return "small-question-text"
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
		} else if (option === undefined) {
			return ""
		}
		var selected = options[option]
		return selected.title
	},
	result: function (){
		if (this.q.outcome){
			return this.q.outcome
		} else {
			return this.q.play
		}
	},
	winnings: function ( answered, outcome ){
		var contains = outcome.indexOf(answered)

		addCommas = function(number){
			return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}

		if (contains > -1) {
			return "+ " + addCommas(parseInt(this.a.wager * this.a.multiplier)) + "</strong>"
		} else if (outcome === "Removed" || this.q.type === 'freePickk'){
			return "+ " + this.a.wager
		} else if (outcome !== undefined && answered !== outcome) {
			return "- " + this.a.wager
		}
	},
	details: function() {
		var extended = Template.parentData(2).extended
		var answerExtended = this.extended
		if (extended || answerExtended) {
			return true
		}
	},
	timeAgo: function(){
		var answerCreated = this.a.dateCreated
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
});

Template.singleAnswer.events({
	'click': function(){
		Router.go('/question/' + this.q._id);
	}
})
