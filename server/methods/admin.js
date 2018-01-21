Meteor.methods({
	'awardTrophy': function(trophyId, user) {
		check(trophyId, String);
		check(user, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		var timeCreated = new Date();
		UserList.update({_id: user}, {$push: {"profile.trophies": trophyId}})
	},

	'nextPeriod': function (game, period){
		check(game, String);
		check(period, Number);

		var users = GamePlayed.find({gameId: game, period: period}).fetch()
		var pushList = _.map(users, function(user){
			var userObj = UserList.findOne({_id: user.userId})
			if (userObj.oneSignal && userObj.oneSignal.userId){
				return userObj.oneSignal.userId
			}
		});
		Meteor.call('endOfQuarterPush', game, pushList)
		return Games.update({_id: game}, {$set: {period: period + 1}})
	},

	'deactivateStatus': function(questionId) {
		check(questionId, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		Questions.update({"_id": questionId}, {$set: {'active': null, "pending": true}});
	},

	'togglePrizeActive': function(id, status){
		check(id, String);
		check(status, Boolean);
		console.log(id, status)
	}
});
