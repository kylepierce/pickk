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

	'awardDiamonds': function(o) {
		check(o, Object);
		
		var value = parseInt(o.value)
    o.type = "diamonds"

	  if (!o.message) {
	  	o.message = "You Earned " + value + " Diamonds!"
	  }

	  // Add coins to gameId or week
	  GamePlayed.update({userId: o.userId, gameId: o.gameId}, {$inc: {diamonds: + value}})
	  
	  createPendingNotification(o)
	},

	'coinMachine': function(game) {
		check(game, String)
		this.unblock()
		var usersThatPlayed = GamePlayed.find({gameId: game});
		var gameName = Games.findOne({_id: game}).name // Easier then querying it later

		exchangeRate = function (coins, rate, userId) {
			var diamondExchange = Math.floor(coins / rate)
			var message = "You traded " + coins + " coins you earned playing " + gameName + " for " + diamondExchange + ' diamonds!'

			var o = {
				userId: userId, 
				gameId: game,
				gameName: gameName,
				value: diamondExchange, 
				message: message, 
				source: "Exchange"
			}

			Meteor.call('awardDiamonds', o)
		};

		usersThatPlayed.forEach(function(item) {
			var userId = item.userId;
			var coins = item.coins
			if (coins === 10000) {
			} else if (coins < 10000) {
				exchangeRate(coins, 2500, userId)
			} else if (coins > 10001) {
				exchangeRate(coins, 7500, userId)
			}
		});
	},

	'awardLeaders': function(game) {
		check(game, String);
		this.unblock()
		var usersThatPlayed = GamePlayed.find({gameId: game}, {sort: {coins: -1}, limit: 10}).fetch();
		var gameName = Games.findOne({_id: game}).name // Easier then querying it later

		function awardTrophies(trophyId, user) {
			var a = {
	      userId: user,
	      type: "trophy",
	      trophyId: trophyId,
	      gameId: game,
	      gameName: gameName
    	}
			Meteor.call('awardTrophy', trophyId, user);
			Meteor.call('notifyTrophyAwarded', a);
		}

		var diamondsToAward = [50, 40, 30, 25, 22, 20, 17, 15, 12, 10]

		for (var i = 0; i < usersThatPlayed.length ; i++) {

			var o = {
				userId: usersThatPlayed[i].userId, 
				gameId: game,
				gameName: gameName,
				source: "Leaderboard",
				value: diamondsToAward[i]
			}

			switch (i){
				case 0:
					awardTrophies('xNMMTjKRrqccnPHiZ', usersThatPlayed[0].userId)
					o.message = 'Congrats On Winning First Place! Here is 50 Diamonds!'
					o.trophyId = "xNMMTjKRrqccnPHiZ"
					Meteor.call('awardDiamonds', o)
					break;
				case 1:
					awardTrophies('aDJHkmcQKwgnpbnEk', usersThatPlayed[1].userId)
					 40, 
					o.message = 'Congrats On Winning Second Place! Here is 40 Diamonds!'
					o.trophyId = "aDJHkmcQKwgnpbnEk"
					Meteor.call('awardDiamonds', o)
					break;
				case 2:
					awardTrophies('YxG4SKtrfT9j8Abdk', usersThatPlayed[2].userId)
					o.message = 'Congrats On Winning Third Place! Here is 30 Diamonds!', 
					o.trophyId = "YxG4SKtrfT9j8Abdk"
					Meteor.call('awardDiamonds', o)
					break;
				default:
					Meteor.call('awardDiamonds', o)
			}
		}
	},

	'endGame': function(game){
		check(game, String);
		this.unblock()
		Games.update({_id: game}, {$set: {"close_processed": true, "status": "completed", live: false, completed: true}})
		Meteor.call('awardLeaders', game);
		Meteor.call('coinMachine', game);

	}
})