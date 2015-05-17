
Meteor.methods({
	'insertQuestion' : function(que, game){
		// Variables to make the calling easy
		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		// Insert the question into the database
		QuestionList.insert({
			que: que,
			dateCreated: timeCreated,
			active: true,
			game: game,
			createdBy: currentUserId
		});
	},

	//Once a users has answered take the amount wager from their coins.
	'takeCoins' : function( userID, questionId, wager) {
		QuestionList.update(questionId, {$push: {usersAnswered: userID}});
		Meteor.users.update( {_id: userID}, {$inc: { "profile.coins": -wager}} );
	},

	//Once the play starts change active status
	'deactivateStatus' : function(questionId){
		QuestionList.update(questionId, {$set: {active: null}});
	},

	'modifyQuestionStatus' : function(questionId, answer){
		QuestionList.update(questionId, {$set: {active: false, play: answer}});

		var usersRun = _.pluck( QuestionList.find({"_id": questionId}).fetch(), 'usersRun' );
		var usersPass = _.pluck( QuestionList.find({"_id": questionId}).fetch(), 'usersPass' );
		var usersInterception = _.pluck( QuestionList.find({"_id": questionId}).fetch(), 'usersInterception' );
		var usersFumble = _.pluck( QuestionList.find({"_id": questionId}).fetch(), 'usersFumble' );

		function awardPoints(user) {
			for (var i = user.length - 1; i >= 0; i--) {
					var winner = user[i];
					var amount = parseInt(winner.amount * 2)
					console.log("This user gets " + amount + " coins " + winner.userID);
					Meteor.users.update( {_id: winner.userID}, {$inc: { "profile.coins": amount}} );
			};
		};

		if (answer == "run") {
			usersRun.map(function (user) {
				awardPoints(user);
			});
		} else if (answer == "pass" ) {
			usersPass.map(function (user) {
				awardPoints(user);
			});
		} else if (answer == "fumble" ) {
			usersFumble.map(function (user) {
				awardPoints(user);
			});
		} else if (answer == "interception" ) {
			usersInterception.map(function (user) {
				awardPoints(user);
			});
		}
	},


	'questionAnswered' : function( user, questionId, answer, wager){
		//Add question, wager and answer to the user's account.
		Meteor.users.update( { _id: user}, {$push: {questionAnswered: { questionId: questionId, 
			wager: wager, answered: answer}}});

		//Update the question with the users answer and wager.
		if (answer == "Run"){
			QuestionList.update(questionId, {$push: { usersRun: {userID: user, amount: wager } }});
		} else if (answer == "Pass"){
			QuestionList.update(questionId, {$push: {usersPass: {userID: user, amount: wager}}});
		} else if (answer == "Fumble"){
			QuestionList.update(questionId, {$push: {usersFumble: {userID: user, amount: wager}}});
		} else if (answer == "Interception"){
			QuestionList.update(questionId, {$push: {usersInterception: {userID: user, amount: wager}}});
		}
	}
});