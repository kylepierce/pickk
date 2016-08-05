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

	// Create a question. Each play has question text and six options.

	'insertQuestion': function(gameId, que, commercial, op1, m1, op2, m2, op3, m3, op4, m4, op5, m5, op6, m6, active) {
		check(gameId, String);
		check(que, String);
		check(commercial, Match.Maybe(Boolean));
		check(op1, String);
		check(m1, Number);
		check(op2, String);
		check(m2, Number);
		check(op3, String);
		check(m3, Number);
		check(op4, String);
		check(m4, Number);
		check(op5, Match.Maybe(String));
		check(m5, Match.Maybe(Number));
		check(op6, Match.Maybe(String));
		check(m6, Match.Maybe(Number));
		check(active, Match.Maybe(String));
			
		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		if (!active) {
			var active = true
		}

		// If there less than 6 options we will set the other options to nothing.
		op5 = op5 || '';
		m5 = m5 || '';
		op6 = op6 || '';
		m6 = m6 || '';

		// Insert the question into the database
		Questions.insert({
			que: que,
			gameId: gameId,
			createdBy: currentUserId,
			dateCreated: timeCreated,
			active: active,
			commercial: commercial,
			options: {
				option1: {title: op1, multiplier: m1},
				option2: {title: op2, multiplier: m2},
				option3: {title: op3, multiplier: m3},
				option4: {title: op4, multiplier: m4},
				option5: {title: op5, multiplier: m5},
				option6: {title: op6, multiplier: m6},
			},
			usersAnswered: []
		});
	},

	'insertFourQuestion': function(gameId, que, commercial, op1, m1, op2, m2, op3, m3, op4, m4, active) {
		check(gameId, String);
		check(que, String);
		check(commercial, Match.Maybe(Boolean));
		check(op1, String);
		check(m1, Number);
		check(op2, String);
		check(m2, Number);
		check(op3, String);
		check(m3, Number);
		check(op4, String);
		check(m4, Number);
		check(active, Match.Maybe(Boolean));

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		if (!active) {
			var active = true
		}

		// Insert the question into the database
		Questions.insert({
			que: que,
			gameId: gameId,
			createdBy: currentUserId,
			dateCreated: timeCreated,
			active: active,
			commercial: commercial,
			options: {
				option1: {title: op1, multiplier: m1},
				option2: {title: op2, multiplier: m2},
				option3: {title: op3, multiplier: m3},
				option4: {title: op4, multiplier: m4},
			},
			usersAnswered: []
		});
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

		Questions.update(questionId, {$set: {'active': true}});
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
