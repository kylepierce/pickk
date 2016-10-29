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
		return Questions.find({}).fetch()
	},
	answers: function (id) {
		var answer = Answers.findOne({"questionId": id})
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
		if (this.q.active === true){
			return "history-inprogress" // In progress 
		} else if (this.q.active === null){
			return "history-pending" // Pending
		} else if (this.q.outcome === this.a.answered){
			return "history-correct" // Correct
		} else {
			return "history-incorrect" // Incorrect
		}
	},
	title: function ( option ){
		if (option === "Removed" || option === "deleted") {
			return "Removed"
		} else if (option === true || option === false) {
			return option
		} else if (option === undefined) {
			return ""
		}
		var options = this.q.options
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
		if (answered === outcome) {
			return "+" + parseInt(this.a.wager * this.a.multiplier)
		} else if (outcome === "Removed" || this.q.type === 'freePickk'){ 
			return "+" + this.a.wager 
		} else if (outcome !== undefined && answered !== outcome) {
			return "-" + this.a.wager 
		} else {
			return "Waiting..."
		}
	},
	details: function() {
		var extended = Template.parentData(2).extended
		if (extended){
			return true
		}
	}
});