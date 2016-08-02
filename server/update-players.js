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

	'coinMachine': function(game) {
		var usersThatPlayed = GamePlayed.find({gameId: game});
		var gameName = Games.findOne({_id: game}).name

		usersThatPlayed.forEach(function(item) {
			var userId = item.userId;
			var coins = item.coins
			var exchange = "exchange"

			exchangeRate = function (rate) {
				var diamondExchange = coins / rate
				diamondExchange = Math.floor(diamondExchange)
				var message = "You traded " + coins + " coins you earned playing " + gameName + " for " + diamondExchange + ' diamonds '
				Meteor.call('awardDiamondsCustom', userId, diamondExchange, message, exchange)
			};

			if (coins === 10000) {

			} else if (coins < 10000) {
				exchangeRate(2500)
			} else if (coins > 10001) {
				exchangeRate(7500)
			}
		});
	},

	'awardLeaders': function(game) {
		var usersThatPlayed = GamePlayed.find({gameId: game}, {sort: {coins: -1}, limit: 10}).fetch();

		function awardTrophies(trophyId, user) {
			Meteor.call('awardTrophy', trophyId, user);
			Meteor.call('notifyTrophyAwarded', trophyId, user);
		}

		var diamondsToAward = [50, 40, 30, 25, 22, 20, 17, 15, 12, 10]

		for (var i = 0; i < usersThatPlayed.length ; i++) {
			switch (i){
				case 0:
					awardTrophies('xNMMTjKRrqccnPHiZ', usersThatPlayed[0].userId)
					Meteor.call('awardDiamondsCustom', usersThatPlayed[0].userId, 50, '<img style="max-width:100%;" src="/1st.png"> <br>Congrats On Winning First Place Here is 50 Diamonds!', "leader")
					break;
				case 1:
					awardTrophies('aDJHkmcQKwgnpbnEk', usersThatPlayed[1].userId)
					Meteor.call('awardDiamondsCustom', usersThatPlayed[1].userId, 40, '<img style="max-width:100%;" src="/2nd.png"> <br>Congrats On Winning Second Place Here is 20 Diamonds!', "leader")
					break;
				case 2:
					awardTrophies('YxG4SKtrfT9j8Abdk', usersThatPlayed[2].userId)
					Meteor.call('awardDiamondsCustom', usersThatPlayed[2].userId, 30, '<img style="max-width:100%;" src="/3rd.png"> <br>Congrats On Winning Third Place Here is 30 Diamonds!', "leader")
					break;
				default:
					Meteor.call('awardDiamonds', usersThatPlayed[i].userId, diamondsToAward[i])
			}
		}
	},
})