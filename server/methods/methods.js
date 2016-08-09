Meteor.methods({
	'userExists': function(username) {
		return !!UserList.findOne({"profile.username": username});
	},

	'activeQuestions': function (gameId) {
		Questions.update({gameId: gameId}, {$set: {'active': true}},  {multi: true})
	},

	'toggleCommercial': function(game, toggle) {
		check(game, String);
		check(toggle, Boolean);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		Games.update(game, {$set: {'commercial': toggle}});
	},

	// Create options
	'createOptions': function(inputs, type){
		check(inputs, Object);
		check(type, String);

		if ( type === "drive") {
			var optionList = ["Punt", "Interception", "Fumble", "Touchdown", "Field Goal", "Other"]
		}

		if (inputs.down === 1) {
			var optionArray = ["Run", "Pass", "Interception", "Pick Six", "Fumble", "Touchdown"]
		}

		if (inputs.down === 2) {
			var optionArray = ["Negative Yards", "0-5 Yard Run", "6-20 Yard Run", "0-5 Yard Pass/Incomplete", "6-20 Yard Pass", "21+ Gain (Run or Pass)"]
		}

		if (inputs.down === 3 && inputs.area === 6) {
			var optionArray = ["Run", "Pass", "Pick Six", "Interception", "Fumble", "Touchdown"]
		} else {
			var optionArray = ["Unable to Covert First Down", "Convert to First Down", "Pick Six", "Interception", "Fumble", "Touchdown"]
		}

		if (inputs.down === 4 && inputs.area >= 4 ) {
			var optionArray = ["Kick Good!", "Run", "Pass", "Fumble", "Missed Kick", "Blocked Kick"]
		} else {
			var optionArray = ["Fair Catch", "0-20 Yard Return", "21-40 Yard Return", "Blocked Punt", "Fumble",  "Touchdown"]
		}

		// Create the options of the play
		var options = {}
		var optionNum = 1
		
		optionList.map(function (option){
			var optionNumber = "option" + optionNum
			options[optionNumber] = {"option": optionNumber, "title": option}
			optionNum += 1
		});

		return options
	},

	'questionText': function (inputs, type) {
		check(inputs, Object);
		check(type, String);
		
		if ( type === "drive") {
			var que = "How will this drive end?"
		}
		switch (inputs.down){
			case 1: 
				var que = "First Down..."
				break;
			case 2: 
				var que = "Second Down..."
				break;
			case 3: 
				var que = "Third Down..."
				break;
			case 4: 
				var que = "Fourth Down..."
				break;
			case 5: 
				var que = "Point After..."
				break;
			case 6: 
				var que = "Kickoff..."
				break;
		}
		return que
	},

	// Create a question. Each play has question text and six options.

	'insertQuestion': function(q) {
		check(q, Object);
			
		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		// function randomizer(min, max){
		// 	return (Math.random() * (max-min) + min).toFixed(2)
		// }
		q["que"] = Meteor.call('questionText', q.inputs, q.type )

		var options = Meteor.call('createOptions', q.inputs, q.type )
		
		console.log(q, options)

		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		// Insert the question into the database
		// Questions.insert({
		// 	que: que,
		// 	gameId: gameId,
		// 	createdBy: currentUserId,
		// 	dateCreated: timeCreated,
		// 	active: active,
		// 	commercial: commercial,
		// 	options: q.options,
		// 	usersAnswered: []
		// });
	},

	'createTrueFalse': function(que, gameId) {
		check(que, String);
		check(gameId, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		Questions.insert({
			que: que,
			gameId: gameId,
			createdBy: currentUserId,
			dateCreated: timeCreated,
			active: true,
			commercial: true,
			binaryChoice: true,
			options: {
				option1: {title: "True"},
				option2: {title: "False"},
			},
			usersAnswered: []
		})
	},

	'createTwoOption': function(gameId, que, option1, multiplier1, option2, multiplier2) {
		check(gameId, String);
		check(que, String);
		check(option1, String);
		check(multiplier1, Number);
		check(option2, String);
		check(multiplier2, Number);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		Questions.insert({
			que: que,
			gameId: gameId,
			createdBy: currentUserId,
			dateCreated: timeCreated,
			active: true,
			commercial: false,
			binaryChoice: true,
			options: {
				option1: {title: option1, multiplier: multiplier1},
				option2: {title: option2, multiplier: multiplier2},
			},
			usersAnswered: []
		})
	},


	'reactivateStatus': function(questionId) {
		check(questionId, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}
		Questions.update({"_id": questionId}, {$set: {'active': true}});
	},

	// If the play is stopped before it starts or needs to be deleted for whatever reason.

	'removeQuestion': function(questionId) {
		check(questionId, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		Questions.update(questionId, {$set: {active: false, play: "deleted"}});

		function awardPointsBack(answer) {
			// Update users coins
			var amount = parseInt(answer.wager)
			var user = answer.userId
			var game = answer.game
			var scoreMessage = "Play was removed. Here are your " + amount + " coins"

			GamePlayed.update({userId: user, gameId: game}, {$inc: {coins: amount}});

		  var notifyObj = {
		  	userId: user,
				type: "score",
				message: scoreMessage,
				amount: amount,
				gameId: game,
		  }

		  createPendingNotification(notifyObj)
		}

		Answers.find({questionId: questionId}).forEach(awardPointsBack);
	},



// Remove Coins from the people who answered it "correctly", the answer changed.

	'unAwardPoints': function(questionId, oldAnswered) {
		check(questionId, String);
		check(oldAnswered, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		var question = Questions.findOne({"_id": questionId});

		function unAwardPoints(answer) {
			// Adjust multiplier based on when selected.

			var amount = parseInt(answer.wager * answer.multiplier);

			// Update users coins
			var user = answer.userId
			var game = answer.gameId
			GamePlayed.update({userId: user, gameId: game}, {$inc: {coins: -amount}});
		}

		Answers.find({questionId: questionId, answered: oldAnswered}).forEach(unAwardPoints);
	},

	'unAwardPointsForDelete': function(questionId, oldAnswered) {
		check(questionId, String);
		check(oldAnswered, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		Questions.update(questionId, {$set: {active: false, play: "deleted"}});

		var question = Questions.findOne({"_id": questionId});

		function unAwardPoints(answer) {
			// Adjust multiplier based on when selected.
			var amount = parseInt(answer.wager * answer.multiplier);
			var scoreMessage = "Play overturned bummer :( " + amount + " Coins!"
			var user = answer.userId
			var game = answer.gameId
			GamePlayed.update({userId: user, gameId: game}, {$inc: {coins: -amount}});

		  var notifyObj = {
		  	userId: user,
				type: "score",
				message: scoreMessage,
				amount: amount,
				gameId: game,
		  }

		  createPendingNotification(notifyObj)
		}

		Answers.find({questionId: questionId, answered: oldAnswered}).forEach(unAwardPoints);
	},

	'awardInitalCoins': function(questionId) {
		check(questionId, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		var question = Questions.findOne({"_id": questionId});

		function awardPointsBack(answer) {
			// Update users coins
			var amount = parseInt(answer.wager)
			var userId = answer.userId
			var scoreMessage = "Play had removed. Here are your " + amount + " coins"
			var user = answer.userId
			var game = answer.gameId
			GamePlayed.update({userId: user, gameId: game}, {$inc: {coins: amount}});

		  var notifyObj = {
		  	userId: user,
				type: "score",
				message: scoreMessage,
				amount: amount,
				gameId: game,
		  }

		  createPendingNotification(notifyObj)
		}

		Answers.find({questionId: questionId}).forEach(awardPointsBack);
	},

	'isGroupNameUnique': function(name) {
		name = name.trim()
		if (!name) {
			return true;
		}
		return !Groups.find({groupId: {$ne: name}}).count()
	},
	'exportToMailChimp': function(limit) {
		check(limit, Number);

		limit = limit || 10; // safety net; pass a very high limit to export all users
		var user = UserList.findOne(this.userId);
		var role = user.profile.role;
		if (role !== "admin") {
			throw new Meteor.Error(403, "Unauthorized");
		}
		var selector = {"emails.address": {$exists: true}};
		var options = {sort: {_id: 1}, limit: limit};
		UserList.find(selector, options).forEach(function(user) {
			console.info("[exportToMailChimp] Subscribing " + user.emails[0].address + " (" + user._id + ")");
			mailChimpLists.subscribeUser(user, {double_optin: false}, function(error, result) {
				if (error) {
					console.error("[exportToMailChimp] Error for " + user.emails[0].address + ": " + JSON.stringify(error));
				} else {
					console.info("[exportToMailChimp] Result for " + user.emails[0].address + ": " + JSON.stringify(result));
				}
			});
		});
	}
});
