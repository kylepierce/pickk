validateAnswer = function (questionId, answer) {
	var userId = Meteor.userId();
	var question = Questions.findOne({_id: questionId});
	var option = question.options[answer];

	if (!option) {
		throw new Meteor.Error("Can't find the option '" + answered + "' for question #" + questionId);
	} else if (~question.usersAnswered.indexOf(userId)) {
		throw new Meteor.Error("User already answered question");
	} else {
		return true
	}
}

hasEnoughCoins = function (gameId, period, wager){
	var userId = Meteor.userId();
	var selector = {userId: userId, gameId: gameId, period: period}
	var userCoins = GamePlayed.findOne(selector).coins;

	if ( userCoins >= wager ) {
		return true
	} else {
		analytics.track("no coins", {
			id: userId,
			where: "Server",
			gameId: gameId,
			wager: wager,
			userCoins: userCoins
		});
		throw new Meteor.Error("Not Enough Coins!");
	}
}

Meteor.methods({
	'activityForDiamonds': function(selector){
		check(selector, Object);
		var game = Games.findOne({_id: selector.gameId});
		selector.counter = GamePlayed.findOne(selector).queCounter
		selector.gameName = game.name

		var stringCounter = selector.counter.toString()
		var activityExchange = {
			"1": 1, "3": 2, "8": 3, "15": 4, "30": 5, "45": 6, "60": 7, "75": 8, "100": 9, "125": 12, "150": 14,
		}
		selector.source = "Activity"

		var x = activityExchange.hasOwnProperty(stringCounter);
		if (x) {
			selector.value = activityExchange[stringCounter]
			Meteor.call('awardDiamonds', selector)
		}
	},

	'questionAnsweredAnalytics': function(answer) {
		if(answer.multiplier < 2.5){
			var multiplierRange = "low"
		} else if (answer.multiplier < 4.5){
			var multiplierRange = "med"
		} else if (answer.multiplier < 10){
			var multiplierRange = "high"
		} else if (answer.multiplier < 99){
			var multiplierRange = "game changer"
		}

		analytics.track("question answered", {
			id: Meteor.userId(),
			gameId: answer.gameId,
			questionId: answer.questionId,
			answered: answer.answered,
			period: answer.period,
			type: answer.type,
			multiplier: answer.multiplier,
			multiplierRange: answer.multiplierRange,
			wager: answer.wager
		});
	},

	'insertAnswer': function (answer){
		check(answer, Object);
		var obj = {
			dateCreated: new Date(),
			userId: Meteor.userId(),
			gameId: answer.gameId,
			questionId: answer.questionId,
			answered: answer.answered,
			type: answer.type
		}
		addToObject = function (key, value) {
			if (value) {
				obj[key] = value
			}
		}

		addToObject("period", answer.period)
		addToObject("wager", answer.wager)
		addToObject("multiplier", answer.multiplier)
		addToObject("description", answer.description)
		Answers.insert(obj);
	},

	'answerDailyPickk': function (prediction) {
		check(prediction, Object);
		var userId = Meteor.userId();
		var isValid = validateAnswer(prediction.questionId, prediction.answer);

		if (isValid) {
			var scoreMessage = "Thanks for Pickking! Here Are " + 5 + " Diamonds!"
			var selector = {userId: userId, gameId: prediction.gameId}
			var gamePlayed = {
	      gameId: prediction.gameId,
	      userId: userId,
	      type: "daily-pickk"
	    }

			Meteor.call('userJoinsAGame', gamePlayed, function(error, result){
				if(error) {
					console.log(error);
				} else {
					GamePlayed.update({_id: result[0]._id}, {$inc: {diamonds: 5}});
					Questions.update({_id: prediction.questionId}, {$addToSet: {usersAnswered: userId}});
					Games.update({_id: prediction.gameId}, {$addToSet: {users: userId}});
					var game = Games.findOne({_id: prediction.gameId});
					var notifyObj = {
						userId: userId,
						gameId: prediction.gameId,
						questionId: prediction.questionId,
						source: "Daily Pickks",
						gameName: game.name,
						type: "diamonds",
						value: 5, // Free coins
						message: scoreMessage,
					}

					var o = {
						userId: prediction.userId,
						gameId: prediction.gameId,
						questionId: prediction.questionId,
						gameName: gameName,
						value: 5,
						source: "Daily Pickks"
					}

					//Give user a diamond for answering
					Meteor.call('awardDiamonds', o);

					createPendingNotification(notifyObj);

					console.log(prediction);
					Meteor.call('insertAnswer', prediction);
				}
			});
		}
	},

	"answerFreePickk": function(prediction){
		check(prediction, Object);
		var userId = Meteor.userId();
		var isValid = validateAnswer(prediction.questionId, prediction.answered);

		if (isValid) {
			var selector = {userId: userId, gameId: prediction.gameId, period: prediction.period}
			var modify = {
				$inc: {queCounter: +1, coins: +prediction.wager},
				$set: {lastUpdated: new Date()}
			}
			GamePlayed.update(selector, modify, true);
			Questions.update({_id: prediction.questionId}, {$addToSet: {usersAnswered: userId}});
			Games.update({_id: prediction.gameId}, {$addToSet: {users: userId}});
			var question = Questions.findOne({_id: prediction.questionId})
			var game = Games.findOne({_id: prediction.gameId});
			var gameName = game.name
			var scoreMessage = 'Predicted "' + question.options[prediction.answered].title + '" for ' + prediction.wager + " Free Coins!"

			var notifyObj = {
				userId: userId,
				gameId: prediction.gameId,
				questionId: prediction.questionId,
				source: "Free-Pickks",
				gameName: game.name,
				type: "coins",
				value: prediction.wager, // Free coins
				message: scoreMessage,
			}

			createPendingNotification(notifyObj);

			Meteor.call('insertAnswer', prediction);
		}
	},

	"answerNormalQuestion": function(prediction){
		check(prediction, Object);
		var userId = Meteor.userId();
		var isValid = validateAnswer(prediction.questionId, prediction.answered);
		var selector = {userId: userId, gameId: prediction.gameId, period: prediction.period}
		var enoughCoins = hasEnoughCoins(prediction.gameId, prediction.period, prediction.wager);

		if (isValid && enoughCoins) {
			var modify = {
				$inc: {coins: -prediction.wager, queCounter: +1},
				$set: { lastUpdated: new Date() }
			}
			GamePlayed.update(selector, modify);
			Meteor.call('activityForDiamonds', selector);

			Questions.update({_id: prediction.questionId}, {$addToSet: {usersAnswered: userId}});
			Games.update({_id: prediction.gameId}, {$addToSet: {users: userId}});

			Meteor.call('insertAnswer', prediction);
		}
	}
});