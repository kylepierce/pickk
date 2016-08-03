Meteor.methods({
	'questionAnswered': function(questionId, answered, wager, description) {
		check(questionId, String);
		check(answered, String);
		check(wager, String);
		check(description, String);

		var question = Questions.findOne(questionId);
		var timeCreated = new Date();
		if (~question.usersAnswered.indexOf(this.userId)) {
			return
		}

		var option = question.options[answered];
		if (!option) {
			throw new Meteor.Error("Can't find the option '" + answered + "' for question #" + questionId)
		}

		wager = parseInt(wager || "0", 10);
		description = description || "";
		var multiplier = parseFloat(option.multiplier || "0");

    Answers.insert({
			userId: this.userId,
			gameId: question.gameId,
			dateCreated: timeCreated,
			questionId: questionId,
			answered: answered,
			wager: wager,
			multiplier: multiplier,
			description: description
		});

		// Update question with the user who have answered.
		Questions.update(questionId, {$addToSet: {usersAnswered: this.userId}});

		Games.update({live: true}, {$addToSet: {users: this.userId}});

		//Once a users has answered take the amount wager from their coins.
		var user = this.userId
		var game = question.gameId
		console.log(user + " " + game)
		GamePlayed.update({userId: user, gameId: game}, {$inc: {coins: -wager}});

		//Increase counter by 1
		Meteor.users.update(this.userId, {$inc: {"profile.queCounter": +1}});

		var currentUser = Meteor.users.findOne(this.userId)
		var counter = currentUser.profile.queCounter

		if (counter === 1) {
			Meteor.call('awardDiamonds', this.userId, 1)
		} else if (counter === 5) {
			Meteor.call('awardDiamonds', this.userId, 2)
		} else if (counter === 25) {
			Meteor.call('awardDiamonds', this.userId, 3)
		} else if (counter === 50) {
			Meteor.call('awardDiamonds', this.userId, 4)
		} else if (counter === 75) {
			Meteor.call('awardDiamonds', this.userId, 5)
		} else if (counter === 100) {
			Meteor.call('awardDiamonds', this.userId, 7)
		} else if (counter === 140) {
			Meteor.call('awardDiamonds', this.userId, 13)
		}
	},
	'twoOptionQuestionAnswered': function(questionId, answered, wager, description) {
		check(questionId, String);
		check(answered, String);
		check(wager, String);
		check(description, String);

		var question = Questions.findOne(questionId);
		var timeCreated = new Date();
		if (~question.usersAnswered.indexOf(this.userId)) {
			return
		}

		var option = question.options[answered];
		if (!option) {
			throw new Meteor.Error("Can't find the option '" + answered + "' for question #" + questionId)
		}

		wager = parseInt(wager || "0", 10);
		description = description || "";
		var multiplier = parseFloat(option.multiplier || "0");

		Answers.insert({
			userId: this.userId,
			gameId: question.gameId,
			questionId: questionId,
			dateCreated: timeCreated,
			answered: answered,
			wager: wager,
			multiplier: multiplier,
			description: description
		});

		// Update question with the user who have answered.
		Questions.update(questionId, {$addToSet: {usersAnswered: this.userId}});

		// Add user to the users who have played in the game.
		Games.update(question.gameId, {$addToSet: {users: this.userId}});

		//Once a users has answered take the amount wager from their coins.
			var user = this.userId
			var game = question.gameId
			GamePlayed.update({userId: user, gameId: game}, {$inc: {coins: -wager}});

		//Increase counter by 1
		Meteor.users.update(this.userId, {$inc: {"profile.queCounter": +1}});

		var currentUser = Meteor.users.findOne(this.userId)
		var counter = currentUser.profile.queCounter

		if (counter === 1) {
			Meteor.call('awardDiamonds', this.userId, 1)
		} else if (counter === 5) {
			Meteor.call('awardDiamonds', this.userId, 2)
		} else if (counter === 25) {
			Meteor.call('awardDiamonds', this.userId, 3)
		} else if (counter === 50) {
			Meteor.call('awardDiamonds', this.userId, 4)
		} else if (counter === 75) {
			Meteor.call('awardDiamonds', this.userId, 5)
		} else if (counter === 100) {
			Meteor.call('awardDiamonds', this.userId, 7)
		} else if (counter === 140) {
			Meteor.call('awardDiamonds', this.userId, 13)
		}
	},

	'binaryQuestionAnswered': function(questionId, answered, wager, description) {
		check(questionId, String);
		check(answered, String);
		check(wager, String);
		check(description, String);

		var question = Questions.findOne(questionId);
		var timeCreated = new Date();

		if (~question.usersAnswered.indexOf(this.userId)) {
			return
		}

		var option = question.options[answered];
		if (!option) {
			throw new Meteor.Error("Can't find the option '" + answered + "' for question #" + questionId)
		}

		wager = parseInt(wager || "0", 10);
		description = description || "";
		var multiplier = parseFloat(option.multiplier || "0");

		Answers.insert({
			userId: this.userId,
			gameId: question.gameId,
			questionId: questionId,
			dateCreated: timeCreated,
			answered: answered,
			wager: wager,
			multiplier: multiplier,
			description: description
		});

		// Update question with the user who have answered.
		Questions.update(questionId, {$addToSet: {usersAnswered: this.userId}});

		// Add user to the users who have played in the game.
		Games.update(question.gameId, {$addToSet: {users: this.userId}});

		//Once a users has answered take the amount wager from their coins.
		var user = this.userId
		var game = question.gameId
		GamePlayed.update({userId: user, gameId: game}, {$inc: {coins: wager}});

		var scoreMessage = "Thanks for Guessing! Here Are " + wager + " Free Coins!"

	  var notifyObj = {
	  	type: "score",
	  	questionId: questionId,
	  	gameId: game,
	  	amount: wager,
	  	message: scoreMessage,
	  	userId: user,
	  }
  	createPendingNotification(notifyObj)
	},

	'gameQuestionAnswered': function(questionId, answered, wager, description) {
		check(questionId, String);
		check(answered, String);
		check(wager, String);
		check(description, String);

		var question = Questions.findOne(questionId);
		var timeCreated = new Date();

		if (~question.usersAnswered.indexOf(this.userId)) {
			return
		}

		var option = question.options[answered];
		if (!option) {
			throw new Meteor.Error("Can't find the option '" + answered + "' for question #" + questionId)
		}

		wager = parseInt(wager || "0", 10);
		description = description || "";
		var multiplier = parseFloat(option.multiplier || "0");

		Answers.insert({
			userId: this.userId,
			gameId: question.gameId,
			questionId: questionId,
			dateCreated: timeCreated,
			answered: answered,
			wager: wager,
			multiplier: multiplier,
			description: description
		});

		// Update question with the user who have answered.
		Questions.update(questionId, {$addToSet: {usersAnswered: this.userId}});

		var notifyObj = {
			userId: this.userId,
			type: "diamonds",
			questionId: questionId,
			value: 5,
		}

		createPendingNotification(notifyObj)

		//Give user a diamond for answering
		Meteor.call('awardDiamonds', this.userId, 5);
	},
})