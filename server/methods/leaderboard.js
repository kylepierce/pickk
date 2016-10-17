Meteor.methods({
	'loadLeaderboard': function(game) {
		check(game, String);
		this.unblock()
		var singleGame = Games.findOne({_id: game});
		if (singleGame) {
			var selector = {_id: {$in: singleGame.users}}
			var fields = {fields: {
				'profile.username': 1, 
				'profile.avatar': 1, 
				'_id': 1
			}}
			return UserList.find(selector, fields).fetch();
		} else {
			return [];
		}
	},

	'loadWeekLeaderboard': function(week) {
		check(week, Number);
		var start = new Date(); 
		this.unblock()
		// Week starts on Tuesday and ends monday night
		var startDay = moment().day("Tuesday").startOf('day').add(4, "hour").week(week)._d;
		var endDay = moment().day("Monday").startOf('day').add(28, "hour").week(week+1)._d;

		// Find all the games during this week
		var selector = {scheduled: {$gte : startDay, $lt: endDay}}
		var fields = {fields: {_id: 1, users: 1}}
		var games = Games.find(selector, fields).fetch()

		var activeUsers = [] 
		var uniqueUser = []
		var userDiamonds = []

		// Find the users from each game
		games.forEach(function (game) {
			var numberOfUsers = game.users && game.users.length
			// Check if the game has any users 
			if (game.users !== undefined && numberOfUsers !== 0){
				var gameUsers = game.users
				gameUsers.forEach(function (user) {
					activeUsers.push({userId: user, gameId: game._id})
					uniqueUser.push(user)
				});
			}
		});

		var uniqueUser = _.uniq(uniqueUser)

		// Each user find the number of diamonds they have
		var singleUser = uniqueUser.map(function (u) {
			Meteor.call('thisWeeksDiamonds', u, week, function (error, result) {
				var diamonds = result[0].result
					userDiamonds.push({user: u, diamonds: diamonds})
			});
		})

		var fixed = _.sortBy(userDiamonds, function(obj){return obj.diamonds})
		var list = fixed.reverse()
		var rank = _.first(list, 25)

		var end = new Date();
		var duration = (end - start);
		console.log("Duration: ", duration)
		return rank

	},
})