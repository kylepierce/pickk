Meteor.methods({
	'activityForDiamonds': function(d){

		if (d.counter === 1) {
			Meteor.call('awardDiamonds', d.userId, d.gameId, 1)
		} else if (d.counter === 5) {
			Meteor.call('awardDiamonds', d.userId, d.gameId, 2)
		} else if (d.counter === 25) {
			Meteor.call('awardDiamonds', d.userId, d.gameId, 3)
		} else if (d.counter === 50) {
			Meteor.call('awardDiamonds', d.userId, d.gameId, 4)
		} else if (d.counter === 75) {
			Meteor.call('awardDiamonds', d.userId, d.gameId, 5)
		} else if (d.counter === 100) {
			Meteor.call('awardDiamonds', d.userId, d.gameId, 7)
		} else if (d.counter === 140) {
			Meteor.call('awardDiamonds', d.userId, d.gameId, 13)
		}
	},

	'questionAnswered': function(c) {
		check(c, Object);

		// Validate a few things 
		var timeCreated = new Date();
		var question = Questions.findOne(c.questionId);
		description = c.description || "";
		
		// See if they already answered the question
		if (~question.usersAnswered.indexOf(c.userId)) {
			return
		}

		// Make sure the option is valid
		var option = question.options[c.answered];
		if (!option) {
			throw new Meteor.Error("Can't find the option '" + answered + "' for question #" + questionId)
		}

		if (c.type === "live" || c.type === "atBat"){
			wager = parseInt(c.wager || "0", 10);
			var multiplier = parseFloat(c.multiplier || "0");
		}		

		// Then insert into answers.

    Answers.insert({
			userId: c.userId,
			gameId: c.gameId,
			questionId: c.questionId,
			type: c.type,
			dateCreated: timeCreated,
			answered: c.answered,
			wager: c.wager,
			multiplier: c.multiplier,
			description: c.description
		});

		var answer = Answers.findOne({questionId: c.questionId, userId: c.userId})

		// Update question with the user who have answered.
		Questions.update(c.questionId, {$addToSet: {usersAnswered: c.userId}});

		// Finally award or whatever

		// Live game questions remove coins and give activity diamonds
		if (c.type === "live" || c.type === "atBat"){
			Games.update({_id: c.gameId}, {$addToSet: {users: c.userId}});

			var selector = {userId: c.userId, gameId: c.gameId}
			var modify = {$inc: {coins: -c.wager}}
			GamePlayed.update(selector, modify);
			
			//Increase counter by 1
			Meteor.users.update({_id: c.userId}, {$inc: {"profile.queCounter": +1}})
			var counter = Meteor.users.findOne(c.userId).profile.queCounter
			var diamondExchange = {userId: c.userId, counter: counter, gameId: c.gameId}
			// Award diamonds if they have been active
			Meteor.call('activityForDiamonds', diamondExchange)
		} 

		// Free pickks give coins and adds a notification
		else if (c.type === "free pickk"){
			var scoreMessage = "Thanks for Guessing! Here Are " + wager + " Free Coins!"

		  var notifyObj = {
		  	type: "score",
		  	questionId: c.questionId,
		  	gameId: c.gameId,
		  	value: c.wager, // Free coins
		  	message: scoreMessage,
		  	userId: c.userId,
		  }

  		createPendingNotification(notifyObj)
		} 

		// Game predictions give diamonds and notification.
		else if (c.type === "prediction") {
			var notifyObj = {
				userId: c.userId,
				type: "diamonds",
				questionId: c.questionId,
				value: 5,
			}

			createPendingNotification(notifyObj)

			//Give user a diamond for answering
			Meteor.call('awardDiamonds', c.userId, c.gameId, 5);
		}
	},
})