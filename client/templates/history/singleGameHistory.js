Template.gameHistory.helpers({
	questions: function (number){
		var $gameId = Router.current().params.id
		Meteor.subscribe('questionsByGameId', $gameId, number)
		Meteor.subscribe('answersByGameId', $gameId, number)
		return Questions.find({}, {sort: {dateCreated: -1}, limit: number}).fetch()
	},
	answers: function (id) {
		var answer = Answers.findOne({"questionId": id})
		return answer
	}
});

Template.singleAnswer.helpers({
	// answer: function () {
	// 	console.log(this, this.q)
	// 	return Answers.findOne({"questionId": this.q._id})
	// },
	active: function (status){
		if(status === true){
			return 'still-active'
		}
	},
	correct: function ( answered, outcome ) {
		if (answered === outcome) {
			return 'winner'
		}
	},
	title: function ( option ){
		if (option === "Removed" || option === "deleted") {
			return "Removed"
		} else if (option === true || option === false) {
			return option
		}
		var options = this.q.options
		var selected = options[option]
		return selected.title
	},
	result: function (){
		if (this.q.outcome){
			console.log(this.q.outcome)
			return this.q.outcome
		} else {
			return this.q.play
		}
	},
	winner: function ( answered, outcome ) {
		if (answered === outcome) {
			true
		}
	},
	winnings: function ( answered, outcome ){
		return parseInt(this.a.wager * this.a.multiplier)
	}
});

Template.gameHistory.helpers({
	foo: function () {
		// ...
	}
});