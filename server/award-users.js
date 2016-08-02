Meteor.methods({
	// Once the play is over update what option it was. Then award points to those who guessed correctly.

	'modifyQuestionStatus': function(questionId, answered) {
		check(questionId, String);
		check(answered, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}
		
		Questions.update(questionId, {$set: {active: false, play: answered}});

		var question = Questions.findOne({"_id": questionId});

		var list = []

		function awardPoints(answer) {
			// Adjust multiplier based on when selected.
			var amount = parseInt(answer.wager * answer.multiplier);
			var user = answer.userId
			var game = answer.gameId
			var que = question.que
			var scoreMessage = "Nice Pickk! You got " + amount + " Coins!"
			var sharable = false
			if(amount > 10000){
				var shareMessage = "I Earned " + amount + " Coins! By Predicting '" + answer.description + "' for '" + que + "'!"
				var sharable = true
			}
			// See if user is on list already
			var check = _.indexOf(list, answer.userId)

			// If they are on the list exit the award process
			if (check !== -1) {
				console.log("Cant get double points for entering!")
				return
			}
			if (!shareMessage){
				var shareMessage = ""
			}
			// if they are not we are going to add them to the list.
			list.push(answer.userId)

			var notifyObj = {
				type: "score",
				message: scoreMessage,
				gameId: game,
				questionId: questionId,
				value: amount,
				sharable: sharable,
				shareMessage: shareMessage
			}

  		createPendingNotification(notifyObj)

			// Update users coins
			GamePlayed.update({userId: user, gameId: game}, {$inc: {coins: amount}});
		}

		Answers.find({questionId: questionId, answered: answered}).forEach(awardPoints);
	},

	'modifyTwoOptionQuestionStatus': function(questionId, answered) {
		check(questionId, String);
		check(answered, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		Questions.update(questionId, {$set: {active: false, play: answered}});

		var question = Questions.findOne({"_id": questionId});

		var list = []

		function awardPoints(answer) {
			// Adjust multiplier based on when selected.
			var amount = parseInt(answer.wager * answer.multiplier)
			var user = answer.userId
			var game = answer.gameId
			var scoreMessage = "Nice Pickk! You got " + amount + " Coins!"
			var que = question.que
			var sharable = false
			if(amount > 10000){
				var shareMessage = "I Earned " + amount + " Coins! By Predicting '" + answer.description + "' for '" + que + "'!"
				var sharable = true
			}

			// See if user is on list already
			var check = _.indexOf(list, answer.userId)

			// If they are on the list exit the award process
			if (check !== -1) {
				console.log("Cant get double points for entering!")
				return
			}

			// if they are not we are going to add them to the list.
			list.push(answer.userId)

			var notifyObj = {
				type: "score",
				message: scoreMessage,
				gameId: game,
				questionId: questionId,
				value: amount,
				sharable: sharable,
				shareMessage: shareMessage
			}

  		createPendingNotification(notifyObj)

			// Update users coins
			GamePlayed.update({userId: user, gameId: game}, {$inc: {coins: amount}});

			// Yeah this needs to be cleaned. I wanted to make sure it worked

		}

		Answers.find({questionId: questionId, answered: answered}).forEach(awardPoints);
	},

	'modifyBinaryQuestionStatus': function(questionId, answered) {
		check(questionId, String);
		check(answered, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		Questions.update(questionId, {$set: {active: false, play: answered}});

		var question = Questions.findOne({"_id": questionId});

		var list = []

		function awardPoints(answer) {
			// Adjust multiplier based on when selected.
			var que = question.que
			var amount = parseInt(2000)
			var user = answer.userId
			var game = answer.gameId
			var scoreMessage = 'Nice Pickk! "' + que + '" 2000 Coins!'

			// See if user is on list already
			var check = _.indexOf(list, answer.userId)

			// If they are on the list exit the award process
			if (check !== -1) {
				console.log("Cant get double points for entering!")
				return
			}

			// if they are not we are going to add them to the list.
			list.push(answer.userId)

			var notifyObj = {
				type: "score",
				message: scoreMessage,
				gameId: game,
				value: amount,
				questionId: questionId,
				sharable: sharable,
				shareMessage: shareMessage
			}

  		createPendingNotification(notifyObj)

			// Update users coins
			GamePlayed.update({userId: user, gameId: game}, {$inc: {coins: amount}});
		}

		Answers.find({questionId: questionId, answered: answered}).forEach(awardPoints);
	},

	'modifyGameQuestionStatus': function(questionId, answered) {
		check(questionId, String);
		check(answered, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		Questions.update(questionId, {$set: {active: false, play: answered}});

		var question = Questions.findOne({"_id": questionId});

		var list = []

		function awardPoints(user) {
			// Adjust multiplier based on when selected.
			var amount = 10
			var scoreMessage = "Nice Pickk on " + question.que + "! You Earned " + amount + " Diamonds!"

			// See if user is on list already
			var check = _.indexOf(list, user.userId)

			// If they are on the list exit the award process
			if (check !== -1) {
				console.log("Cant get double points for entering!")
				return
			}

			// if they are not we are going to add them to the list.
			list.push(user.userId)
			var notifyObj = {
				type: "diamonds",
				questionId: questionId,
				message: scoreMessage,
				gameId: game,
				value: amount,
			}

  		createPendingNotification(notifyObj)

			// Update users diamonds
			Meteor.users.update({_id: user.userId},
				{
					$inc: {"profile.diamonds": amount},
				})

		}

		Answers.find({questionId: questionId, answered: answered}).forEach(awardPoints);
	},
})