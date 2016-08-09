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
		check(beta, Boolean);
		
		if(beta === true){
			var selector = {"profile.diamonds": {$gt: 0}, "profile.role": {$eq: "beta"}}
		} else {
			var selector = {"profile.diamonds": {$gt: 0}, "profile.role": {$ne: "beta"}}
		}
		var fields = {fields: {'profile.username': 1, 'profile.diamonds': 1, 'profile.avatar': 1, '_id': 1}}
		return UserList.find(selector, fields).fetch();
	},
})