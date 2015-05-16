
Meteor.methods({
	'insertQuestion' : function(que, game){

		// Variables to make the calling easy

		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		// Insert the question into the database
		QuestionList.insert({
			que: que,
			dateCreated: timeCreated,
			game: game,
			createdBy: currentUserId,
			active: true
		});
	},
	'modifyQuestionStatus' : function(questionId, answer){
		QuestionList.update(questionId, {$set: {active: false, play: answer}});

		var usersRun = _.pluck( QuestionList.find({"_id": questionId}).fetch(), 'usersRun' );
		var usersPass = _.pluck( QuestionList.find({"_id": questionId}).fetch(), 'usersPass' );
		var usersInterception = _.pluck( QuestionList.find({"_id": questionId}).fetch(), 'usersInterception' );
		var usersFumble = _.pluck( QuestionList.find({"_id": questionId}).fetch(), 'usersFumble' );

		if (answer === "run") {
			usersRun.map(function (user) {
				console.log("These users get 100 coins " + user);
				for (var i = user.length - 1; i >= 0; i--) {
					Meteor.users.update( {_id: user[i]}, {$inc: { "profile.coins": 100}} );
				};
			});
		} else if (answer === "pass" ) {
			usersPass.map(function (user) {
				console.log("These users get 100 coins " + user);
				for (var i = user.length - 1; i >= 0; i--) {
					Meteor.users.update( {_id: user[i]}, {$inc: { "profile.coins": 100}} );
				};
				
			});
		}
	},

	'deactivateStatus' : function(questionId){
		QuestionList.update(questionId, {$set: {active: null}});
	},

	'questionAnswered' : function( user, questionId, answer, wager){
		Meteor.users.update( { _id: user}, {$push: {questionAnswered: { questionId: questionId, 
			wager: wager, answered: answer}}});
		if (answer === "run"){
			console.log("Selected Run...");
			QuestionList.update(questionId, {$push: {usersRun: user}});
		} else if (answer === "pass"){
			console.log("Selected Pass...");
			QuestionList.update(questionId, {$push: {usersPass: user}});
		} else if (answer === "fumble"){
			console.log("Selected Fumble...");
			QuestionList.update(questionId, {$push: {usersFumble: user}});
		} else {
			console.log("Selected Interception...");
			QuestionList.update(questionId, {$push: {usersInterception: user}});
		}
	}
});