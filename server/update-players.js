Meteor.methods({
	'updateAllCounters': function(user) {
		var user = UserList.findOne({_id: user})
		var role = user.profile.role
		if (role === "admin") {
			UserList.update({}, {$set: {"profile.queCounter": 0}}, {multi: true})
		}
	},

	'updateAllDiamonds': function(user) {
		var user = UserList.findOne({_id: user})
		var role = user.profile.role
		if (role === "admin") {
			UserList.update({}, {$set: {"profile.diamonds": 0}}, {multi: true})
		}
	},

	'awardDiamonds': function(user, number) {
		var timeCreated = new Date();
		var id = Random.id();
		var number = parseInt(number)
		var message = "You Earned " + number + " Diamonds!"

		Meteor.users.update({_id: user}, {$inc: {"profile.diamonds": +number}});

		Meteor.users.update({_id: user},
			{
				$push: {
					pendingNotifications: {
						_id: id,
						type: "diamonds",
						read: false,
						notificationId: id,
						dateCreated: timeCreated,
						message: message
					}
				}
			}
		)
	},

	'awardDiamondsCustom': function(user, number, message, tag) {
		var timeCreated = new Date();
		var id = Random.id();
		var number = parseInt(number)
		var message = message

		Meteor.users.update({_id: user}, {$inc: {"profile.diamonds": +number}});

		Meteor.users.update({_id: user},
			{
				$push: {
					pendingNotifications: {
						_id: id,
						type: "diamonds",
						tag: tag,
						read: false,
						notificationId: id,
						dateCreated: timeCreated,
						message: message
					}
				}
			}
		)
	},

	'coinMachine': function() {
		var userIds = _.pluck(Meteor.users.find({}, {
			fields: {
				_id: 1,
				"profile.coins": 1,
				"profile.diamonds": 1
			}
		}).fetch(), '_id');

		userIds.forEach(function(item) {
			var user = UserList.findOne({_id: item});
			var coins = user.profile.coins
			var exchange = "exchange"
			if (coins === 10000) {

			}
			if (coins < 10000) {
				var diamondExchange = coins / 2500
				diamondExchange = Math.floor(diamondExchange)
				var message = "You traded " + coins + " coins for " + diamondExchange + ' diamonds'
				Meteor.call('awardDiamondsCustom', item, diamondExchange, message, exchange)
				Meteor.users.update({_id: item}, {$set: {"profile.coins": 0}});
			}
			if (coins > 10001) {
				var diamondExchange = coins / 7500
				diamondExchange = Math.floor(diamondExchange)
				var message = "You traded " + coins + " coins for " + diamondExchange + ' diamonds'
				Meteor.call('awardDiamondsCustom', item, diamondExchange, message, exchange)
				Meteor.users.update({_id: item}, {$set: {"profile.coins": 0}});
			}
		});
	},

	'awardLeaders': function(user) {
		var liveGame = Games.findOne({live: true});
		var selector = {_id: {$in: liveGame.users}}
		var leaderboard = UserList.find(
			selector,
			{
				fields: {
					'profile.username': 1,
					'profile.coins': 1,
					'profile.avatar': 1,
					'_id': 1
				}
			}, {sort: {'profile.coins': -1}}).fetch();
		var fixed = _.sortBy(leaderboard, function(obj) {
			return obj.profile.coins
		})
		fixed.reverse()

		function awardTrophies(trophyId, user) {
			Meteor.call('awardTrophy', trophyId, user);
			Meteor.call('notifyTrophyAwarded', trophyId, user);
		}

		var user = UserList.findOne({_id: user})
		var role = user.profile.role
		if (role === "admin") {
			awardTrophies('xNMMTjKRrqccnPHiZ', fixed[0]._id)

			Meteor.call('awardDiamondsCustom', fixed[0]._id, 50, '<img style="max-width:100%;" src="/1st.png"> <br>Congrats On Winning First Place Here is 50 Diamonds!', "leader")

			awardTrophies('aDJHkmcQKwgnpbnEk', fixed[1]._id)
			Meteor.call('awardDiamondsCustom', fixed[1]._id, 40, '<img style="max-width:100%;" src="/2nd.png"> <br>Congrats On Winning Second Place Here is 20 Diamonds!', "leader")

			awardTrophies('YxG4SKtrfT9j8Abdk', fixed[2]._id)
			Meteor.call('awardDiamondsCustom', fixed[2]._id, 30, '<img style="max-width:100%;" src="/3rd.png"> <br>Congrats On Winning Third Place Here is 30 Diamonds!', "leader")

			Meteor.call('awardDiamonds', fixed[3]._id, 25)
			Meteor.call('awardDiamonds', fixed[4]._id, 22)
			Meteor.call('awardDiamonds', fixed[5]._id, 20)
			Meteor.call('awardDiamonds', fixed[6]._id, 17)
			Meteor.call('awardDiamonds', fixed[7]._id, 15)
			Meteor.call('awardDiamonds', fixed[8]._id, 12)
			Meteor.call('awardDiamonds', fixed[9]._id, 10)
		}
	},
})