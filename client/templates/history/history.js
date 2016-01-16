Template.history.created = function () {
  this.autorun(function () {
		var user = Meteor.userId();
		Meteor.subscribe("questionsUserAnswered", user)
  }.bind(this));
};

Template.history.helpers({
	question: function () {
		// var user = Meteor.userId();
		// Meteor.subscribe("questionsUserAnswered", user)
		var answered = QuestionList.find({}, {sort: {dateCreated: -1}}).fetch()
		return answered
	},
	userAnswer: function(id, questionObj){
		var user = Meteor.user();
		var questions = user.questionAnswered
		var questionId = _.pluck(questions, "questionId")
		var spot = _.indexOf(questionId, id)
		var question = questions[spot]
		console.log(question)
		console.log(questionObj)
		var userAnswer = question.answered
		// userAnswer = JSON.stringify(userAnswer)
		console.log(userAnswer)
		// userAnswer = "option1"
		// console.log(userAnswer)
		var options = questionObj.options
		console.log(options)
		var number = userAnswer.slice(-1)
		console.log(number)
		var play = _.values(options)
		console.log(play.userAnswer)
		// console.log("correct answer " + correct)
		// console.log("You answered " + question.answered)
		// console.log("multiplier is " + multiplier)
		
		// if(correct === userAnswer){
		// 	console.log("Looks like we made it!")
		// 	return "YAY YOU DID IT"
		// } else {
		// 	return "Incorrect"
		// }
	},
	game: function(id){
		var game = Games.findOne({_id: id}, {fields: {name: 1}});
		game = game.name
		return game
	},
	correct: function(answered, correct){
		console.log(answered)
		console.log(correct)
		if(answered === correct){
			return "Correct!"
		}
	}
});

