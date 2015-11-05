Meteor.methods({
  'userExists': function(username){
    return !!UserList.findOne({"profile.username": username});
  },

  'questionPush': function(game, message){
  	var game = Games.findOne({_id: game})
  	var users = game.nonActive
  	console.log("sent push to " + users)
  	message = "Guess What Happens on " + message 
  	Push.send({
  		from: 'Pickk', 
  		title: 'Update', 
  		text: message, 
  		sound: 'default',
  		badge: 1, 
  		query: {userId: {$in: users}} });
  },

  'emptyInactive': function(game){
  	var game = Games.findOne({_id: game})
  	console.log("removing all users from inactive")
  	var gameId = game._id
  	return Games.update({_id: gameId}, {$set: {'nonActive': [] }}, {multi:true} );
  },

  'playerInactive': function(user, questionId){
  	var gameInfo = QuestionList.findOne({_id: questionId})
		var gameId = gameInfo.gameId
  	var game = Games.find(
				{_id: gameId, 
				nonActive: {$nin: [user]}}, {fields: {'nonActive': 1}}).fetch();
		if(game.length == 1){
			Games.update(gameId, {$push: {nonActive: user}});
			console.log("added " + user + " to the inactive list")
		}
  },

  'push': function(game, message){
  	Push.send({
  		from: 'Pickk', 
  		title: 'Update', 
  		text: message, 
  		badge: 1, 
  		sound: 'default',
  		query: {}
  	});
  },

  'pushInvite': function(message, userId){
  	Push.send({from: 'Pickk', title: 'Invite', text: message, badge: 1, query: {_id: userId}});
  },

  'toggleCommercial': function(game, toggle){
  	Games.update(game, {$set: {'commercial': toggle}});
  },

  'createGame': function(team1, team2, title, active, channel, gameTime){
  	var timeCreated = new Date();
  	Games.insert({
  		teams: [team1, team2],
  		dateCreated: timeCreated,
  		gameDate: gameTime,
  		name: title,
  		tv: channel,
  		commercial: false,
  		complete: false,
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

 // Update users info from the settings page

  'addTrophy' : function(name, description, img){
		Trophies.insert({
			title: name,
			description: description,
			image: img
		});
  },

  'awardTrophy': function(trophyId, user){
  	UserList.update({_id: user}, {$push: {"profile.trophies": trophyId}})
  },

	'notifyTrophyAwarded' : function(trophyId, user){
		var timeCreated = new Date();
		var id = Random.id();
		UserList.update({_id: user}, 
		{$push:
			{pendingNotifications: 
				{
				_id: id,
				type: "trophy",
				notificationId: trophyId,
				dateCreated: timeCreated 
				}
			}
		});
	},

	'removeNotification': function(notifyId){
		var user = Meteor.userId()
		UserList.update({_id: user}, 
			{$pull: 
				{pendingNotifications: 
					{_id: notifyId}
				}
			})
	},

	'readNotification': function(notifyId){
		var user = Meteor.userId()
		UserList.update({_id: user}, 
			{$pull: 
				{pendingNotifications: 
					{_id: notifyId}
				}
			})
	},

  // Way for Admin to manually update users coins 

  'updateCoins' : function(user, coins){
  	var amount = parseInt(coins)
		Meteor.users.update( {_id: user}, {$set: { "profile.coins": amount}} );  
	},

  'updateAllCoins' : function(coins){
  	var amount = parseInt(coins)
		UserList.update({}, {$set: { "profile.coins": amount}}, { multi: true });  
	},

// Way for Admin to manually update users name 

	'updateName' : function(user, name){
		Meteor.users.update( {_id: user}, {$set: { "profile.username": name}} );  
	},

	'resendVerifyEmail': function(){
		var testdata = Meteor.users.find({}, {sort: {dateCreated: -1}, limit: 3});
		testdata.forEach(function(item){
		  if (!item.emails[0].verified) {
		    console.log(item._id, item.profile.username);
		    Accounts.sendVerificationEmail(item._id);
		  }
		});
		console.log("Email Sent!")
	},
  
	// Create a question. Each play has question text and six options. 

	'insertQuestion' : function(game, que, commercial, op1, m1, op2, m2, op3, m3, op4, m4, op5, m5, op6, m6){
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
			commercial: commercial,
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

	'createTrueFalse': function(que, game){
		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		QuestionList.insert({
			que: que,
			gameId: game,
			createdBy: currentUserId,
			dateCreated: timeCreated,
			active: true,
			commercial: true,
			binaryChoice: true,
			options: {
				option1: {title: "True", usersPicked: []},
				option2: {title: "False", usersPicked: []},
			}

		})
	},

		'binaryQuestionAnswered' : function( user, questionId, answer){
		var timeCreated = new Date();
		var id = Random.id();
		var scoreMessage = "Thanks for Guessing Here Are " + 1000 + " Free Coins!"
		console.log(scoreMessage)
		console.log(user)
			
		Meteor.users.update( {_id: user}, 
			{$push:
				{pendingNotifications: 
					{
					_id: id,
					type: "score",
					read: false,
					notificationId: id,
					dateCreated: timeCreated,
					message: scoreMessage 
					}
				}
			}
		)

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
		}



		//Once a users has answered take the amount wager from their coins.
		Meteor.users.update( {_id: user}, {$inc: { "profile.coins": +1000}} );


		//Add question, wager and answer to the user's account.
		Meteor.users.update( { _id: user}, {$push: {questionAnswered: { questionId: questionId, answered: answer}}});
		

		//Update the question with the users answer and wager.
		if (answer == "option1"){
			QuestionList.update(questionId, {$push: {'options.option1.usersPicked': {userID: user} }});
		} else if (answer == "option2"){
			QuestionList.update(questionId, {$push: {'options.option2.usersPicked': {userID: user}}});
		}
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
		var timeCreated = new Date();
		var id = Random.id();
		UserList.update({_id: userId}, 
		{$push:
			{pendingNotifications: 
				{
				_id: id,
				dateCreated: timeCreated,
				referrer: ref,
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
		var timeCreated = new Date();
		var id = Random.id();

		UserList.update({_id: user}, {$push: {'profile.following': accountToFollow}});

		UserList.update({_id: accountToFollow}, {$push: {'profile.followers': user}});

		UserList.update({_id: accountToFollow}, 
		{$push:
			{pendingNotifications: 
				{
				_id: id,
				dateCreated: timeCreated,
				referrer: user,
				type: "follower",
				}
			}
		});
		
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
			var timeCreated = new Date();
			var id = Random.id();
			var scoreMessage = "Play was removed. Here are your " + amount + " coins"
			Meteor.users.update( {_id: userId}, {$inc: { "profile.coins": amount}})
					

			// Yeah this needs to be cleaned. I wanted to make sure it worked
			Meteor.users.update( {_id: user.userID}, 
				{$push:
					{pendingNotifications: 
						{
						_id: id,
						type: "score",
						read: false,
						notificationId: id,
						dateCreated: timeCreated,
						message: scoreMessage 
						}
					}
				}
			)


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
			var timeCreated = new Date();
			var id = Random.id();
			var scoreMessage = "Nice Pickk! You got " + amount + " Coins!"
			
			Meteor.users.update( {_id: user.userID}, 
				{$push:
					{pendingNotifications: 
						{
						_id: id,
						type: "score",
						read: false,
						notificationId: id,
						dateCreated: timeCreated,
						message: scoreMessage 
						}
					}
				}
			)

			// Update users coins
			Meteor.users.update( {_id: user.userID}, 
				{$inc: { "profile.coins": amount},
			})

			// Yeah this needs to be cleaned. I wanted to make sure it worked
			
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

	'modifyBinaryQuestionStatus' : function(questionId, answer){
		QuestionList.update(questionId, {$set: {active: false, play: answer }});

		var question = QuestionList.findOne({"_id": questionId});
		var option1 = question.options.option1.usersPicked
		var option2 = question.options.option2.usersPicked

		function awardPoints(user) {
			// Adjust multiplier based on when selected.
			var que = question.que
			var amount = 2000
			var timeCreated = new Date();
			var id = Random.id();
			var scoreMessage = 'Nice Pickk! You Predicted "' + que + '" Correct! You got ' + amount + " Coins!"
			
			Meteor.users.update( {_id: user.userID}, 
				{$push:
					{pendingNotifications: 
						{
						_id: id,
						type: "score",
						read: false,
						notificationId: id,
						dateCreated: timeCreated,
						message: scoreMessage 
						}
					}
				}
			)

			// Update users coins
			Meteor.users.update( {_id: user.userID}, 
				{$inc: { "profile.coins": amount},
			})

			// Yeah this needs to be cleaned. I wanted to make sure it worked
			
		}

		// Can this be switch? Can it be refactored?
		if (answer == "option1") {
			option1.map(function (user) {
				awardPoints(user)
			});
		} else if (answer == "option2" ) {
			option2.map(function (user) {
				awardPoints(user)
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

	'unAwardPointsForDelete' : function(questionId, oldAnswer){
		QuestionList.update(questionId, {$set: {active: false, play: "deleted"}});

		var question = QuestionList.findOne({"_id": questionId});
		var option1 = question.options.option1.usersPicked
		var option2 = question.options.option2.usersPicked
		var option3 = question.options.option3.usersPicked
		var option4 = question.options.option4.usersPicked
		var option5 = question.options.option5.usersPicked
		var option6 = question.options.option6.usersPicked

		function unAwardPoints(user, multiplier) {
			// Adjust multiplier based on when selected.
			var userAmount = user.amount
			var amount = parseInt(userAmount * multiplier)
			var scoreMessage = "Play overturned bummer :( " + amount + " Coins!"
			var timeCreated = new Date();
			var id = Random.id();

			// Update users coins
			Meteor.users.update( {_id: user.userID}, {$inc: { "profile.coins": -amount}
			});

			Meteor.users.update( {_id: user.userID}, 
				{$push:
					{pendingNotifications: 
						{
						_id: id,
						type: "score",
						read: false,
						notificationId: id,
						dateCreated: timeCreated,
						message: scoreMessage 
						}
					}
				}
			)
		}

		// Can this be switch? Can it be refactored?
		if (oldAnswer == "option1") {
			option1.map(function (user) {
				var multiplier = parseFloat(question.options.option1.multiplier);
				unAwardPoints(user, multiplier)
			});
		} else if (oldAnswer == "option2" ) {
			option2.map(function (user) {
				var multiplier = parseFloat(question.options.option2.multiplier);
				unAwardPoints(user, multiplier)
			});
		} else if (oldAnswer == "option3" ) {
			option3.map(function (user) {
				var multiplier = parseFloat(question.options.option3.multiplier);
				unAwardPoints(user, multiplier);
			});
		} else if (oldAnswer == "option4" ) {
			option4.map(function (user) {
				var multiplier = parseFloat(question.options.option4.multiplier);
				unAwardPoints(user, multiplier);
			});
		} else if (oldAnswer == "option5" ) {
			option5.map(function (user) {
				var multiplier = parseFloat(question.options.option5.multiplier);
				unAwardPoints(user, multiplier);
			});
		} else if (oldAnswer == "option6" ) {
			option6.map(function (user) {
				var multiplier = parseFloat(question.options.option6.multiplier);
				unAwardPoints(user, multiplier);
			});
		}
		

		function awardPointsBack(user) {
			// Update users coins
			var amount = parseInt(user.amount)
			var userId = user.userID
			var timeCreated = new Date();
			var id = Random.id();
			var scoreMessage = "Play had removed. Here are your " + amount + " coins"
			Meteor.users.update( {_id: userId}, {$inc: { "profile.coins": amount}})
					

			// Yeah this needs to be cleaned. I wanted to make sure it worked
			Meteor.users.update( {_id: user.userID}, 
				{$push:
					{pendingNotifications: 
						{
						_id: id,
						type: "score",
						read: false,
						notificationId: id,
						dateCreated: timeCreated,
						message: scoreMessage 
						}
					}
				}
			)


		}


				// Loop over each option and award points wagered back.
		option1.map(function (user) {awardPointsBack(user)});
		option2.map(function (user) {awardPointsBack(user)});
		option3.map(function (user) {awardPointsBack(user)});
		option4.map(function (user) {awardPointsBack(user)});
		option5.map(function (user) {awardPointsBack(user)});
		option6.map(function (user) {awardPointsBack(user)});
	},

	// Users answered the question take away coins and put then in group.

	'questionAnswered' : function( user, questionId, answer, wager, description){

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
		}

		//Once a users has answered take the amount wager from their coins.
		Meteor.users.update( {_id: user}, {$inc: { "profile.coins": -wager}} );


		//Add question, wager and answer to the user's account.
		Meteor.users.update( { _id: user}, {$push: {questionAnswered: { questionId: questionId, 
			wager: wager, answered: answer, description: description}}});
		

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


	'questionUnanswered' : function( user, questionId, answer, wager){		
		// Remove user from the answer list
		QuestionList.update({_id: questionId}, {$pull: {usersAnswered: user}})

		//Remove question, wager and answer to the user's account.
		Meteor.users.update( { _id: user}, {$pull: {questionAnswered: { questionId: questionId}}});

		//Update the question with the users answer and wager.
		if (answer == "option1"){
			QuestionList.update(questionId, {$pull: {'options.option1.usersPicked': {userID: user, amount: wager } }});
		} else if (answer == "option2"){
			QuestionList.update(questionId, {$pull: {'options.option2.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option3"){
			QuestionList.update(questionId, {$pull: {'options.option3.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option4"){
			QuestionList.update(questionId, {$pull: {'options.option4.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option5"){
			QuestionList.update(questionId, {$pull: {'options.option5.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option6"){
			QuestionList.update(questionId, {$pull: {'options.option6.usersPicked': {userID: user, amount: wager}}});
		} 

		//Once a users has rmoved question add wager to their coins.
		Meteor.users.update( {_id: user}, {$inc: { "profile.coins": +wager}} );
	}

});