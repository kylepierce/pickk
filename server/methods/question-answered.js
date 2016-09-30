Meteor.methods({
	'activityForDiamonds': function(d){
		check(d, Object);

		var o = {
			userId: d.userId, 
			gameId: d.gameId,
			gameName: d.gameName,
			source: "Activity"
		}
		var stringCounter = d.counter.toString()
		var activityExchange = {
			"1": 1, "3": 2, "8": 3, "15": 4, "30": 5, "45": 6, "60": 7, "75": 8, "100": 9, "125": 12, "150": 14,
		} 

		var x = activityExchange.hasOwnProperty(stringCounter);
		if (x) {
			o.value = activityExchange[stringCounter]
			Meteor.call('awardDiamonds', o)
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

		// Live game questions remove coins and give activity diamonds
		if (c.type === "live" || c.type === "atBat"){
			Games.update({_id: c.gameId}, {$addToSet: {users: c.userId}});

			var selector = {userId: c.userId, gameId: c.gameId}
			var modify = {$inc: {coins: -c.wager, queCounter: +1}}
			GamePlayed.update(selector, modify);

			var gameName = Games.findOne({_id: c.gameId}).name;
			var counter = GamePlayed.findOne(selector).queCounter

			var diamondExchange = {
				userId: c.userId, 
				counter: counter, 
				gameId: c.gameId,
				gameName: gameName
			}

			// Award diamonds if they have been active
			Meteor.call('activityForDiamonds', diamondExchange)
		} 

		// Free pickks give coins and adds a notification
		else if (c.type === "free-pickk"){
			var scoreMessage = "Thanks for Guessing! Here Are " + c.wager + " Free Coins!"

			var selector = {userId: c.userId, gameId: c.gameId}
			var modify = {$inc: {coins: +c.wager}}
			GamePlayed.update(selector, modify);

		  var notifyObj = {
		  	type: "coins",
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
			Games.update({_id: c.gameId}, {$addToSet: {users: c.userId}});
			var gameName = Games.findOne({_id: c.gameId}).name;
			var o = {
				userId: c.userId, 
				gameId: c.gameId,
				questionId: c.questionId,
				gameName: gameName,
				value: 5,
				source: "Daily Pickks"
			}

			//Give user a diamond for answering
			Meteor.call('awardDiamonds', o);
		}
	},
})