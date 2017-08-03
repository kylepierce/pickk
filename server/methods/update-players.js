Meteor.methods({
	'awardDiamonds': function(o) {
		check(o, Object);

		var value = parseInt(o.value)


	  if (!o.message) {
	  	o.message = "You Earned " + value + " Diamonds!"
	  }
		if(o.type === "prediction"){
			var selector = {userId: o.userId, gameId: o.gameId}
		} else {
			o.type = "diamonds"
			var selector = {userId: o.userId, gameId: o.gameId, period: o.period}
		}
	  // Add coins to gameId or week
	  GamePlayed.update(selector, {$inc: {diamonds: + value}})

	  createPendingNotification(o)
	},

	'coinMachine': function(game, period) {
		check(game, String)
		check(period, Number);
		this.unblock()
		var usersThatPlayed = GamePlayed.find({gameId: game, period: period});
		var game = Games.findOne({_id: game})
		var gameName = game.name // Easier then querying it later

		exchangeRate = function (coins, rate, userId) {
			var diamondExchange = Math.floor(coins / rate)
			var message = "You traded " + coins + " coins you earned playing " + gameName + " for " + diamondExchange + ' diamonds!'

			var o = {
				userId: userId,
				gameId: game._id,
				gameName: gameName,
				value: diamondExchange,
				period: period,
				message: message,
				source: "Exchange"
			}
			var message = "End of the quarter. Open the app to see where you finished!"
			Meteor.call('push', message, userId)
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

	'awardLeaders': function(game, period) {
		check(game, String);
		check(period, Number);
		this.unblock();
		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
    }

    if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
    }

		var usersThatPlayed = GamePlayed.find({gameId: game, period: period}, {sort: {coins: -1}, limit: 10}).fetch();
		var gameName = Games.findOne({_id: game}).name // Easier then querying it later

		function awardTrophies(trophyId, user) {
			var a = {
	      userId: user,
	      type: "trophy",
	      trophyId: trophyId,
	      gameId: game,
	      period: period,
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
				period: period,
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
	'openGame': function(gameId){
		check(gameId, String);
		this.unblock()
		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
    }

    if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
    }
		var game = Games.find({_id: gameId}).fetch()
		var registered = game[0].registered
		var gameName = game[0].name
		var message = gameName + " Is Now Open. Challenge A Friend!"
		// Meteor.call('openGamePush', message, registered);

		Games.update({_id: gameId}, {$set: {"status": "In-Progress", "live": true, "users": registered}})
	},

	'endGame': function(gameId){
		check(gameId, String);
		this.unblock()
		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
    }

    if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
    }

    var period = Games.find({_id: gameId}).period

		Games.update({_id: gameId}, {$set: {"close_processed": true, "status": "completed", live: false, completed: true}})
	}
})
