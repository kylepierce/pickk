Meteor.methods({
	// Once the play is over update what option it was. Then award points to those who guessed correctly.
	'modifyQuestionStatus': function(q) {
		check(q, Object);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		var updatedAt = new Date();
		var question = Questions.find({_id: q.questionId}).fetch()
		var previous = question[0].outcome

		if(previous){
			var outcomes = []
			outcomes.push(q.option, previous)
			var modify = {$set: {active: false, outcome: outcomes, lastUpdated: updatedAt}}
		} else {
			var modify = {$set: {active: false, outcome: q.option, lastUpdated: updatedAt}}
		}
		Questions.update({_id: q.questionId}, modify);

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

			var game = GamePlayed.findOne({userId: a.userId, gameId: a.gameId, period: a.period});

			// Update users coins
			GamePlayed.update({userId: a.userId, gameId: a.gameId, period: a.period}, {$inc: {coins: amount}}, createPendingNotification(notifyObj));
		}

		var selector = {questionId: q.questionId, answered: q.option}
		Answers.find(selector).forEach(awardPoints);
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

			a.wager = 5
			// if unique add them to the list.
			list.push(a.userId)
			var amount = parseInt(a.wager * a.multiplier);
			var notifyObj = {
				type: "diamonds",
				userId: a.userId,
				gameId: a.gameId,
				questionId: a.questionId,
				value: amount,
			}

			var game = GamePlayed.findOne({userId: a.userId, gameId: a.gameId});

			// Update users coins
			GamePlayed.update({userId: a.userId, gameId: a.gameId}, {$inc: {diamonds: amount}}, createPendingNotification(notifyObj));
		}

		var selector = {questionId: questionId, answered: answered}
		Answers.find(selector).forEach(awardPoints);
	},
})
