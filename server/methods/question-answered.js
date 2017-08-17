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

	if ( userCoins > wager ) {
		return true
	} else {
		analytics.track("no coins", {
			id: userId,
			where: "Server",
			gameId: gameId,
			wager: wager,
			userCoins: userCoins
		});
		throw new Meteor.Error("User already answered question");
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

	'questionAnsweredAnalytics': function(gameId, period, questionId, type, answer, multiplier, wager) {
		if(multiplier < 2.5){
			var multiplierRange = "low"
		} else if (multiplier < 4.5){
			var multiplierRange = "med"
		} else if (multiplier < 10){
			var multiplierRange = "high"
		} else if (multiplier < 99){
			var multiplierRange = "game changer"
		}

		analytics.track("question answered", {
			id: Meteor.userId(),
			gameId: gameId,
			questionId: questionId,
			answered: answer,
			period: period,
			type: type,
			multiplier: multiplier,
			multiplierRange: multiplierRange,
			wager: wager
		});
	},

	'insertAnswer': function (gameId, questionId, type, answer, period, wager, multiplier, description){
		check(gameId, String);
		check(questionId, String);
		check(type, String);
		check(answer, String);

		check(period, Match.Maybe(Number));
		check(wager, Match.Maybe(Number));
		check(multiplier, Match.Maybe(Number));
		check(description, Match.Maybe(Number));

		var obj = {
			dateCreated: new Date(),
			userId: Meteor.userId(),
			gameId: gameId,
			questionId: questionId,
			answered: answer,
			type: type
		}
		addToObject = function (key, value) {
			if (value) {
				obj[key] = value
			}
		}

		addToObject("period", period)
		addToObject("wager", wager)
		addToObject("multiplier", multiplier)
		addToObject("description", description)
		Answers.insert(obj);
	},

	'answerFreePickk': function (gameId, period, questionId, answer, wager) {
		check(gameId, String);
		check(period, Number);
		check(questionId, String);
		check(answer, String);
		check(wager, Number);

		var userId = Meteor.userId();
		var isValid = validateAnswer(questionId, answer);
		if (isValid) {
			Questions.update({_id: questionId}, {$addToSet: {usersAnswered: userId}});
			Games.update({_id: gameId}, {$addToSet: {users: userId}});

			var scoreMessage = "Thanks for Pickking! Here Are " + wager + " Free Coins!"
			var selector = {userId: userId, gameId: gameId, period: period}
			var modify = {$inc: {coins: +wager}}

			GamePlayed.update(selector, modify);
			Meteor.call('insertAnswer', gameId, questionId, "free-pickk", answer, period, wager, 4);

			var notifyObj = {
				userId: Meteor.userId(),
				gameId: gameId,
				questionId: questionId,
				type: "coins",
				value: wager, // Free coins
				message: scoreMessage,
			}
			createPendingNotification(notifyObj);
		}
	},

	"answerDailyPickk": function(userId, gameId, questionId, answer){
		check(userId, String);
		check(gameId, String);
		check(questionId, String);
		check(answer, String);

		var isValid = validateAnswer(c.questionId, c.answer);
		if (isValid) {
			Questions.update(c.questionId, {$addToSet: {usersAnswered: c.userId}});
			Games.update({_id: c.gameId}, {$addToSet: {users: c.userId}});
			var selector = {userId: c.userId, gameId: c.gameId}
			var modify = {
				$inc: {queCounter: +1},
				$set: {type: "prediction"}
			}
			GamePlayed.update(selector, modify, true);
			Meteor.call('insertAnswer', gameId, questionId, type, answer, period, wager, multiplier, description);

			var game = Games.findOne({_id: c.gameId});
			var gameName = game.name

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

	"answerNormalQuestion": function(gameId, period, questionId, type, answer, multiplier, wager){
		check(gameId, String);
		check(period, Number);
		check(questionId, String);
		check(type, String);
		check(answer, String);
		check(multiplier, Number);
		check(wager, Number);

		var userId = Meteor.userId();
		var isValid = validateAnswer(questionId, answer);
		var selector = {userId: userId, gameId: gameId, period: period}
		var enoughCoins = hasEnoughCoins(gameId, period, wager);

		if (isValid && enoughCoins) {
			Questions.update({_id: questionId}, {$addToSet: {usersAnswered: userId}});
			Games.update({_id: gameId}, {$addToSet: {users: userId}});
			Meteor.call('insertAnswer', gameId, questionId, type, answer, period, wager, multiplier);
			Meteor.call('questionAnsweredAnalytics', gameId, period, questionId, type, answer, multiplier, wager)

			var modify = {$inc: {coins: -wager, queCounter: +1}}
			GamePlayed.update(selector, modify);
			Meteor.call('activityForDiamonds', selector);
		}
	}
});

// if (c.type === "live" || c.type === "atBat"){
// 	wager = parseInt(c.wager || "0", 10);
// 	var multiplier = parseFloat(c.multiplier || "0");
// }

// 'questionAnswered': function(c) {
// 	check(c, Object);
// 	// userId, answered, type, wager, multiplier, gameId, period, questionId, description,
// 	var isValid = validateAnswer(c.questionId, c.answer);
//
// 	// Update question with the user who have answered.
// 	Questions.update(c.questionId, {$addToSet: {usersAnswered: c.userId}});
// 	Games.update({_id: c.gameId}, {$addToSet: {users: c.userId}});
//
// 	// Free pickks give coins and adds a notification
// 	if (c.type === "free-pickk"){
//
// 	} else if (c.type === "prediction") {
//
// 	} else {
//
// 	}
// },
