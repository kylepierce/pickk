Meteor.methods({
	'loadLeaderboard': function(game) {
		check(game, String);
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

	'loadWeekLeaderboard': function() {
		check(beta, Boolean);
		// Find all the games during this week
		
		// Find all of the users from each game

		// Find how many diamonds each user recieved

		// Sort and display

		var fields = {fields: {'profile.username': 1, 'profile.diamonds': 1, 'profile.avatar': 1, '_id': 1}}
		return UserList.find(selector, fields).fetch();
	},
})