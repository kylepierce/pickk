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
		
		var modify = {$set: {active: false, outcome: answered}}
		Questions.update({_id: questionId}, modify);

		var list = []

		function awardPoints(a) {
			// See if user is on list already
			var alreadyExist = _.indexOf(list, a.userId)
			if (alreadyExist !== -1) {
				// If they are on the list exit the award process
				throw new Meteor.Error("dulicate", "Cant win twice");
			}

			// if unique add them to the list.
			list.push(a.userId)
			var amount = parseInt(a.wager * a.multiplier);
			var notifyObj = {
				type: "coins",
				userId: a.userId,
				gameId: a.gameId,
				questionId: a.questionId,
				value: amount,
			}

			var game = GamePlayed.findOne({userId: a.userId, gameId: a.gameId});

			// Update users coins
			GamePlayed.update({userId: a.userId, gameId: a.gameId}, {$inc: {coins: amount}}, createPendingNotification(notifyObj));
		}

		var selector = {questionId: questionId, answered: answered}
		Answers.find(selector).forEach(awardPoints);
	},
})