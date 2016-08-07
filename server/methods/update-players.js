Meteor.methods({
	'updateAllCounters': function(user) {
		check(user, String);
		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
    }

    if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
    }

		var user = UserList.findOne({_id: user})
		var role = user.profile.role
		if (role === "admin") {
			UserList.update({}, {$set: {"profile.queCounter": 0}}, {multi: true})
		}
	},

	'updateAllDiamonds': function(user) {
		check(user, String);
		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
    }

    if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
    }

		var user = UserList.findOne({_id: user})
		var role = user.profile.role
		if (role === "admin") {
			UserList.update({}, {$set: {"profile.diamonds": 0}}, {multi: true})
		}
	},

	'awardDiamonds': function(user, gameId, number) {
		check(user, String)
		check(gameId, String)
		check(number, Number)
		
		var number = parseInt(number)
		var message = "You Earned " + number + " Diamonds!"

		Meteor.users.update({_id: user}, {$inc: {"profile.diamonds": +number}});

	  var notifyObj = {
      type: "diamonds",
      userId: user,
      gameId: gameId,
      value: number,
      message: message,
	  }

	  createPendingNotification(notifyObj)
	},

	'awardDiamondsCustom': function(user, gameId, number, message, trophyId) {
		check(user, String);
		check(gameId, String);
		check(number, Number);
		check(message, String);
		var number = parseInt(number)
		var message = message

		Meteor.users.update({_id: user}, {$inc: {"profile.diamonds": +number}});

	  var notifyObj = {
      type: "diamonds",
      userId: user,
      gameId: gameId,
      message: message,
      value: number,
	  }
	  createPendingNotification(notifyObj)
	},

	'coinMachine': function(game) {
		check(game, String)
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
				Meteor.call('awardDiamondsCustom', userId, game, diamondExchange, message, exchange)
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
		check(game, String);

		var usersThatPlayed = GamePlayed.find({gameId: game}, {sort: {coins: -1}, limit: 10}).fetch();

		function awardTrophies(trophyId, user) {
			Meteor.call('awardTrophy', trophyId, user);
			Meteor.call('notifyTrophyAwarded', trophyId, user, game);
		}

		var diamondsToAward = [50, 40, 30, 25, 22, 20, 17, 15, 12, 10]

		for (var i = 0; i < usersThatPlayed.length ; i++) {
			switch (i){
				case 0:
					awardTrophies('xNMMTjKRrqccnPHiZ', usersThatPlayed[0].userId)
					Meteor.call('awardDiamondsCustom', usersThatPlayed[0].userId, game, 50, 'Congrats On Winning First Place Here is 50 Diamonds!', "xNMMTjKRrqccnPHiZ")
					break;
				case 1:
					awardTrophies('aDJHkmcQKwgnpbnEk', usersThatPlayed[1].userId)
					Meteor.call('awardDiamondsCustom', usersThatPlayed[1].userId, game, 40, 'Congrats On Winning Second Place Here is 20 Diamonds!', "aDJHkmcQKwgnpbnEk")
					break;
				case 2:
					awardTrophies('YxG4SKtrfT9j8Abdk', usersThatPlayed[2].userId)
					Meteor.call('awardDiamondsCustom', usersThatPlayed[2].userId, game, 30, 'Congrats On Winning Third Place Here is 30 Diamonds!', "YxG4SKtrfT9j8Abdk")
					break;
				default:
					Meteor.call('awardDiamonds', usersThatPlayed[i].userId, game, diamondsToAward[i])
			}
		}
	},
})