Meteor.methods({
	'insertQuestion' : function(que, teamOne, teamTwo){

		// Variables to make the calling easy

		var currentUserId = Meteor.userId();

		// Insert the question into the database
		QuestionList.insert({
			que: que,
			teams: [teamOne, teamTwo],
			createdBy: currentUserId,
			active: true,
	   		usersTrue: [],
	   		usersFalse: []
		});
	},
	'modifyQuestionStatus' : function(questionId, answer){
		var questionPath = QuestionList.find({_id: questionId});
		var answeredTrue = questionPath.usersTrue.count();
		console.log(answeredTrue);
		var answeredFalse = questionPath.usersFalse.count();
		console.log(answeredFalse);
		if (answer == true) {
			for (user in questionPath.usersTrue) {
				console.log(user + " answered true when true. got it right") 
			}
			for (user in questionPath.usersFalse) {
				console.log(user + " answered false when true. got it wrong")
			}
		} else {
			for (user in questionPath.usersFalse) {
				console.log(user + " answered false when false. got it right")
			}
			for (user in questionPath.usersTrue) {
				console.log(user + " answered true when false. got it wrong")
			}
		}
		QuestionList.update(questionId, {$set: {active: false, answer: answer}});
	},
	'questionAnswered' : function( user, questionId, answer){
		Meteor.users.update( { _id: user}, {$push: {questionAnswered: questionId}});
		if (answer === true){
			QuestionList.update(questionId, {$push: {usersTrue: user}});
		} else {
			QuestionList.update(questionId, {$push: {usersFalse: user}});
		};
	}
});