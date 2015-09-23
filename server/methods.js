// var Mailgun = Meteor.npmRequire("mailgun").Mailgun;
// var mg = new Mailgun(Meteor.settings.mailgun_apikey);

Meteor.methods({
  'userExists': function(username){
    return !!UserList.findOne({"profile.username": username});
  },

  // 'questionPush': function(game, message){
  // 	var game = Games.findOne({_id: game})
  // 	console.log(game)
  // 	var users = game.nonActive
  // 	console.log(users)
  // 	Push.send({from: 'Test', title: 'Hello', text: message, badge: 1, query: {userId: {$in: users}} });
  // },

  // 'emptyInactive': function(game){
  // 	var game = Games.findOne({_id: game})
  // 	console.log("removing all users from inactive")
  // 	var gameId = game._id
  // 	return Games.update({_id: gameId}, {$set: {'nonActive': [] }}, {multi:true} );
  // },

  // 'playerInactive': function(user, questionId){
  // 	var gameInfo = QuestionList.findOne({_id: questionId})
		// var gameId = gameInfo.gameId
  // 	var game = Games.find(
		// 		{_id: gameId, 
		// 		nonActive: {$nin: [user]}}, {fields: {'nonActive': 1}}).fetch();
		// console.log(game)
		// if(game.length == 1){
		// 	Games.update(gameId, {$push: {nonActive: user}});
		// 	console.log("added " + user + " to the inactive list")
		// }
  // },

  'push': function(game, message){
  	Push.send({from: 'Test', title: 'Hello', text: message, badge: 1, query: {}});
  },

  'toggleCommercial': function(game, toggle){
  	Games.update(game, {$set: {'commercial': toggle}});
  },

  'createGame': function(team1, team2, title, active){
  	var timeCreated = new Date();
  	Games.insert({
  		teams: [team1, team2],
  		dateCreated: timeCreated,
  		name: title,
  		commercial: false,
  		live: active,
  		nonActive: [],
  		users: []
  	});
  },

 // Update users info from the settings page

  'updateProfile' : function(user, username, firstName, lastName){
		UserList.update(user, 
			{$set: 
				{
				'profile.username': username, 
				'profile.firstName': firstName, 
				'profile.lastName': lastName, 
				'profile.avatar': '/twitter_logo.png'
				} 
		});
  },

  // Way for Admin to manually update users coins 

  'updateCoins' : function(user, coins){
  	var amount = parseInt(coins)
		Meteor.users.update( {_id: user}, {$set: { "profile.coins": amount}} );  
	},

// Way for Admin to manually update users name 

	'updateName' : function(user, name){
		Meteor.users.update( {_id: user}, {$set: { "profile.username": name}} );  
	},
  
	// Create a question. Each play has question text and six options. 

	'insertQuestion' : function(game, que, op1, m1, op2, m2, op3, m3, op4, m4, op5, m5, op6, m6){
		// Variables to make the calling easy
		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		// Insert the question into the database
		QuestionList.insert({
			que: que,
			gameId: game,
			createdBy: currentUserId,
			dateCreated: timeCreated,
			active: true,
			options: {
				option1: {title: op1, usersPicked: [], multiplier: m1 },
				option2: {title: op2, usersPicked: [], multiplier: m2 },
				option3: {title: op3, usersPicked: [], multiplier: m3 },
				option4: {title: op4, usersPicked: [], multiplier: m4 },
				option5: {title: op5, usersPicked: [], multiplier: m5 },
				option6: {title: op6, usersPicked: [], multiplier: m6 },
			}
		});
	},

	// Users can create a group

	'createGroup': function(groupId, groupName, secretStatus) {
		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		Groups.insert({
			groupId: groupId,
			name: groupName,
			commissioner: currentUserId,
			dateCreated: timeCreated,
			members: [currentUserId],
			secret: secretStatus,
			avatar: "/twitter_logo.png"
		});

		var groupData = Groups.findOne({'name': groupName});

		Meteor.users.update( {_id: currentUserId}, {$push: { "profile.groups": groupData._id}
		})

	},

	// Users can add other users to join their group.

	'inviteToGroup' : function(userId, ref, noteId){
		UserList.update({_id: userId}, 
		{$push:
			{pendingNotifications: 
				{referrer: ref,
				type: "group",
				notificationId: noteId  
				}
			}
		});
	},

	// Users can join any group

	'joinGroup': function(user, groupId) {
		Groups.update({_id: groupId}, {$push: {members: user}});
		UserList.update({_id: user}, {$push: {'profile.groups': groupId}});
	},

	// Users can leave groups they are apart of

	'leaveGroup': function(user, groupId) {
		Groups.update({_id: groupId}, {$pull: {members: user}});
		UserList.update({_id: user}, {$pull: {'profile.groups': groupId}});
	},

	// Option to follow user 

	'followUser': function(user, accountToFollow) {
		UserList.update({_id: user}, {$push: {'profile.following': accountToFollow}});
		UserList.update({_id: accountToFollow}, {$push: {'profile.followers': user}});
	},

	// Unfollow users they follow

	'unfollowUser': function(user, accountToFollow) {
		UserList.update({_id: user}, {$pull: {'profile.following': accountToFollow}});
		UserList.update({_id: accountToFollow}, {$pull: {'profile.followers': user}});
	},

	//Once the play starts change active status

	'deactivateStatus' : function(questionId){
		QuestionList.update(questionId, {$set: {'active': null}});
	},

	// If the play is stopped before it starts or needs to be deleted for whatever reason.

	'removeQuestion': function(questionId) {
		QuestionList.update(questionId, {$set: {active: false, play: "deleted"}});

		var question = QuestionList.findOne({"_id": questionId});
		var option1 = question.options.option1.usersPicked
		var option2 = question.options.option2.usersPicked
		var option3 = question.options.option3.usersPicked
		var option4 = question.options.option4.usersPicked
		var option5 = question.options.option5.usersPicked
		var option6 = question.options.option6.usersPicked

		function awardPointsBack(user) {
			// Update users coins
			var amount = parseInt(user.amount)
			var userId = user.userID
			Meteor.users.update( {_id: userId}, {$inc: { "profile.coins": amount}})
		}

		// Loop over each option and award points wagered back.
		option1.map(function (user) {awardPointsBack(user)});
		option2.map(function (user) {awardPointsBack(user)});
		option3.map(function (user) {awardPointsBack(user)});
		option4.map(function (user) {awardPointsBack(user)});
		option5.map(function (user) {awardPointsBack(user)});
		option6.map(function (user) {awardPointsBack(user)});

	},

	// Once the play is over update what option it was. Then award points to those who guessed correctly.

	'modifyQuestionStatus' : function(questionId, answer){
		QuestionList.update(questionId, {$set: {active: false, play: answer }});

		var question = QuestionList.findOne({"_id": questionId});
		var option1 = question.options.option1.usersPicked
		var option2 = question.options.option2.usersPicked
		var option3 = question.options.option3.usersPicked
		var option4 = question.options.option4.usersPicked
		var option5 = question.options.option5.usersPicked
		var option6 = question.options.option6.usersPicked

		function awardPoints(user, multiplier) {
			// Adjust multiplier based on when selected.

			var amount = parseInt(user.amount * multiplier)

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
		} else if (answer == "option5" ) {
			option5.map(function (user) {
				var multiplier = parseFloat(question.options.option5.multiplier);
				awardPoints(user, multiplier);
			});
		} else if (answer == "option6" ) {
			option6.map(function (user) {
				var multiplier = parseFloat(question.options.option6.multiplier);
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
		var option5 = question.options.option5.usersPicked
		var option6 = question.options.option6.usersPicked

		function awardPoints(user, multiplier) {
			// Adjust multiplier based on when selected.

			var amount = parseInt(user.amount * multiplier)

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
		} else if (oldAnswer == "option5" ) {
			option5.map(function (user) {
				var multiplier = parseFloat(question.options.option5.multiplier);
				awardPoints(user, multiplier);
			});
		} else if (oldAnswer == "option6" ) {
			option6.map(function (user) {
				var multiplier = parseFloat(question.options.option6.multiplier);
				awardPoints(user, multiplier);
			});
		}
	},

	// Users answered the question take away coins and put then in group.

	'questionAnswered' : function( user, questionId, answer, wager){

		// Update question with the user who have answered.
		QuestionList.update(questionId, {$push: {usersAnswered: user}});

		// Add user to the users who have played in the game.
		var gameInfo = QuestionList.findOne({_id: questionId})
		var gameId = gameInfo.gameId
		var game = Games.find(
				{_id: gameId, 
				users: {$nin: [user]}}, {fields: {'users': 1}}).fetch();
		if(game.length == 1){
			Games.update(gameId, {$push: {users: user}});
			console.log("added " + user + " to the game list")
		}

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
		} else if (answer == "option5"){
			QuestionList.update(questionId, {$push: {'options.option5.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option6"){
			QuestionList.update(questionId, {$push: {'options.option6.usersPicked': {userID: user, amount: wager}}});
		}
	},
	// sendMailgunEmail: function(fromEmail, fromName, toEmails, subject, body, callback) {
 //    var toListString = toEmails.join(",");
 //    mg.sendRaw(fromName + " <" + fromEmail + ">",
 //               toEmails,
 //               "From: " + fromEmail +
 //                "\nTo: " + toListString +
 //                "\nContent-Type: text/html; charset=utf-8" +
 //                "\nSubject: " + subject +
 //                "\n\n" + body,
 //                function(err) {
 //      if (err) {
 //        callback(err, undefined);
 //      }
 //      else {
 //        callback(undefined, true);
 //      }
 //    });
 //  },

 //  addTask: function(title, url) {
 //    Tasks.insert({
 //      title: title,
 //      url: url
 //    });
 //  },

 //  sendEmail: function() {
 //    var tasks = Tasks.find({}).fetch();
 //    var emailData = {
 //      mainTitle: "Your List of Tasks",
 //      tasks: tasks,
 //      unsubscribe: "http://someunsubscribelink.com"
 //    };

 //    var body = EmailGenerator.generateHtml("emailTemplate", emailData);

 //    Meteor.call("sendMailgunEmail",
 //                "from@email.com",
 //                "From Name",
 //                ["to@email.com"],
 //                "Your List of Tasks",
 //                body);
 //  }

});