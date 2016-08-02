Meteor.methods({
	'loadLeaderboard': function(game) {
		var liveGame = Games.findOne({_id: game});
		if (liveGame) {
			var selector = {_id: {$in: liveGame.users}}
			return UserList.find(
				selector,
				{
					fields: {
						'profile.username': 1,
						'profile.avatar': 1,
						'_id': 1
					}
				}).fetch();
		} else {
			return [];
		}
	},

	'loadWeekLeaderboard': function(beta) {
		check(beta, String);
		
		if(beta === true){
			var selector = {"profile.diamonds": {$gt: 0}, "profile.role": {$eq: "beta"}}
		} else {
			var selector = {"profile.diamonds": {$gt: 0}, "profile.role": {$ne: "beta"}}
		}
		var fields = {fields: {'profile.username': 1, 'profile.diamonds': 1, 'profile.avatar': 1, '_id': 1}}
		return UserList.find(selector, fields).fetch();
	},

	//Once the play starts change active status

	'deactivateStatus': function(questionId) {
		check(questionId, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		Questions.update(questionId, {$set: {'active': null}});
	},
})