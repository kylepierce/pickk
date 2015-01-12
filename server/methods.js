
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
		QuestionList.update(questionId, {$set: {active: false, answer: answer}});
		var base = QuestionList.find({_id: questionId}).fetch();
		if (answer == true) {
			base.usersTrue.forEach(function (user) {
				user.update(secret, {$set: {rightCount: 1}} );
			});
			base.usersFalse.forEach(function (user) {
				user.update(secret, {$set: {wrongCount: 1}} );
			});
		} else {
			usersFalse.forEach(function (user) {
				UserList.update(secret, {$set: {rightCount: 1}} );
			});
			usersTrue.forEach(function (user) {
				UserList.update(secret, {$set: {wrongCount: 1}} );
			});
		}
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