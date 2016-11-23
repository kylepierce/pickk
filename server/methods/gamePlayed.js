Meteor.methods({
	'registerForGame': function (userId, gameId){
		check(userId, String);
		check(gameId, String);
		Games.update({_id: gameId}, {$addToSet: {registered: userId}});
	},
	'unregisterForGame': function (userId, gameId){
		check(userId, String);
		check(gameId, String);
		Games.update({_id: gameId}, {$pull: {registered: userId}});
	},
	'userJoinsAGame': function (gamePlayed) {
		check(gamePlayed, Object)

		var gameExists = GamePlayed.findOne(gamePlayed, {fields: {_id: 1, gameId: 1}})

		if(!gameExists){
			var date = new Date(); 
			GamePlayed.insert({
				dateCreated: date,
				userId: gamePlayed.userId,
				gameId: gamePlayed.gameId,
				period: gamePlayed.period,
				coins: 10000,
				type: gamePlayed.type,
				timeLimit: 20,
				diamonds: 0,
				matches: []
			});
		}
	}
});