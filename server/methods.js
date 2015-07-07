Meteor.methods({
  'userExists': function(username){
    return !!Meteor.users.findOne({username: username});
  },


  'updateProfile' : function(user, username, firstName, lastName){
		UserList.update(user, 
			{$set: 
				{
				'profile.username': username, 
				'profile.firstName': firstName, 
				'profile.lastName': lastName, 
				} 
		});
		console.log("Updated " + user + " " + username + " " + firstName + " " + lastName);
  },

  
	'insertQuestion' : function(que, op1, m1, op2, m2, op3, m3, op4, m4){
		// Variables to make the calling easy
		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		// Insert the question into the database
		QuestionList.insert({
			que: que,
			createdBy: currentUserId,
			dateCreated: timeCreated,
			active: true,
			options: {
				option1: {title: op1, usersPicked: [], multiplier: m1 },
				option2: {title: op2, usersPicked: [], multiplier: m2 },
				option3: {title: op3, usersPicked: [], multiplier: m3 },
				option4: {title: op4, usersPicked: [], multiplier: m4 },
			}
		});
	},

	'createGroup': function(groupName, secretStatus) {
		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		Groups.insert({
			name: groupName,
			commissioner: currentUserId,
			dateCreated: timeCreated,
			members: [currentUserId],
			secret: secretStatus
		});

		var groupData = Groups.findOne({'name': groupName});
		console.log(groupData)

		Meteor.users.update( {_id: currentUserId}, {$push: { "profile.groups": groupData._id}
		})

	},

	'joinGroup': function(user, groupId) {
		Groups.update({_id: groupId}, {$push: {members: user}});
		UserList.update({_id: user}, {$push: {'profile.groups': groupId}});
	},

	'leaveGroup': function(user, groupId) {
		Groups.update({_id: groupId}, {$pull: {members: user}});
		UserList.update({_id: user}, {$pull: {'profile.groups': groupId}});
	},

	//Once the play starts change active status
	'deactivateStatus' : function(questionId){
		QuestionList.update(questionId, {$set: {'active': null}});
	},

	'removeQuestion': function(questionId) {
		QuestionList.update(questionId, {$set: {active: false, play: "deleted"}});

		var question = QuestionList.findOne({"_id": questionId});
		var option1 = question.options.option1.usersPicked
		var option2 = question.options.option2.usersPicked
		var option3 = question.options.option3.usersPicked
		var option4 = question.options.option4.usersPicked

		function awardPointsBack(user) {
			// Update users coins
			Meteor.users.update( {_id: user.userID}, {$inc: { "profile.coins": user.amount}
			})
		}

		// Loop over each option and award points wagered back.
		option1.map(function (user) {awardPointsBack(user)});
		option2.map(function (user) {awardPointsBack(user)});
		option3.map(function (user) {awardPointsBack(user)});
		option4.map(function (user) {awardPointsBack(user)});

	},

	// Once the play is over update what option it was. Then award points to those who guessed correctly.
	'modifyQuestionStatus' : function(questionId, answer){
		QuestionList.update(questionId, {$set: {active: false, play: answer }});

		var question = QuestionList.findOne({"_id": questionId});
		var option1 = question.options.option1.usersPicked
		var option2 = question.options.option2.usersPicked
		var option3 = question.options.option3.usersPicked
		var option4 = question.options.option4.usersPicked

		function awardPoints(user, multiplier) {
			// Adjust multiplier based on when selected.

			var amount = parseInt(user.amount * multiplier)
			console.log("This user gets " + amount + " coins " + user.userID);

			// Update users coins
			Meteor.users.update( {_id: user.userID}, {$inc: { "profile.coins": amount}
			})
		}

		// Can this be switch? Can it be refactored?
		if (answer == "option1") {
			option1.map(function (user) {
				var multiplier = parseFloat(question.options.option1.multiplier);
				awardPoints(user, multiplier)
			});
		} else if (answer == "option2" ) {
			option2.map(function (user) {
				var multiplier = parseFloat(question.options.option2.multiplier);
				awardPoints(user, multiplier)
			});
		} else if (answer == "option3" ) {
			option3.map(function (user) {
				var multiplier = parseFloat(question.options.option3.multiplier);
				awardPoints(user, multiplier);
			});
		} else if (answer == "option4" ) {
			option4.map(function (user) {
				var multiplier = parseFloat(question.options.option4.multiplier);
				awardPoints(user, multiplier);
			});
		}
	},

// Remove Coins from the people who answered it "correctly", the answer changed. 
	'unAwardPoints' : function(questionId, oldAnswer){
		var question = QuestionList.findOne({"_id": questionId});
		var option1 = question.options.option1.usersPicked
		var option2 = question.options.option2.usersPicked
		var option3 = question.options.option3.usersPicked
		var option4 = question.options.option4.usersPicked

		function awardPoints(user, multiplier) {
			// Adjust multiplier based on when selected.

			var amount = parseInt(user.amount * multiplier)
			console.log("This user " + amount + " has " + user.userID + " taken away!");

			// Update users coins
			Meteor.users.update( {_id: user.userID}, {$inc: { "profile.coins": -amount}
			})
		}

		// Can this be switch? Can it be refactored?
		if (oldAnswer == "option1") {
			option1.map(function (user) {
				var multiplier = parseFloat(question.options.option1.multiplier);
				awardPoints(user, multiplier)
			});
		} else if (oldAnswer == "option2" ) {
			option2.map(function (user) {
				var multiplier = parseFloat(question.options.option2.multiplier);
				awardPoints(user, multiplier)
			});
		} else if (oldAnswer == "option3" ) {
			option3.map(function (user) {
				var multiplier = parseFloat(question.options.option3.multiplier);
				awardPoints(user, multiplier);
			});
		} else if (oldAnswer == "option4" ) {
			option4.map(function (user) {
				var multiplier = parseFloat(question.options.option4.multiplier);
				awardPoints(user, multiplier);
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
		if (answer == "option1"){
			QuestionList.update(questionId, {$push: {'options.option1.usersPicked': {userID: user, amount: wager } }});
		} else if (answer == "option2"){
			QuestionList.update(questionId, {$push: {'options.option2.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option3"){
			QuestionList.update(questionId, {$push: {'options.option3.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option4"){
			QuestionList.update(questionId, {$push: {'options.option4.usersPicked': {userID: user, amount: wager}}});
		}
	}
});