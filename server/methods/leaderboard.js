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

	'loadWeekLeaderboard': function(data){
		check(data, Object);
		this.unblock();
		var week = data.date

		var startDay = moment().startOf('day').add(4, "hour").day("Tuesday").week(week)._d;
		var endDay = moment().startOf('day').day("Monday").add(28, "hour").week(week+1)._d;

		var selector = {
				dateCreated: {
					$gte : startDay,
					$lt: endDay
				}
			}

		var diamonds = GamePlayed.aggregate(
			{ $match: selector },
			{ $group: {
				_id: '$userId',
				diamonds: { $sum: '$diamonds'}
			}});

		return diamonds
	},

	'gameLeaderboard': function(data){
		check(data, Object);
    this.unblock();

    var selector = {
			gameId: data.gameId
    }

    var coins = GamePlayed.aggregate(
      { $match: selector },
      { $group: {
        _id: null,
        result: { $sum: '$coins'}}
      }
    );
		return coins
	}
});
