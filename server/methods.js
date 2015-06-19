
Meteor.methods({
  "userExists": function(username){
    return !!Meteor.users.findOne({username: username});
  },

  'updateProfile' : function(user, username, firstName, lastName){
		UserList.update(user, 
			{$set: 
				{username: username, firstName: firstName, lastName: lastName}
		});
		console.log("Updated " + user + " " + username + " " + firstName + " " + lastName);
  },

  
	'insertQuestion' : function(que){
		// Variables to make the calling easy
		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		console.log("Created a new question.")
		// Insert the question into the database
		QuestionList.insert({
			que: que,
			dateCreated: timeCreated,
			active: true,
			createdBy: currentUserId
		});
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
					var amount = parseInt(winner.amount * 4)
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
		// Update question with the user who have answered.
		QuestionList.update(questionId, {$push: {usersAnswered: user}});


		//Once a users has answered take the amount wager from their coins.
		Meteor.users.update( {_id: user}, {$inc: { "profile.coins": -wager}} );


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