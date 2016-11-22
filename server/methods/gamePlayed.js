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
	'userJoinsAGame': function (userId, gameId, type) {
		check(userId, String)
		check(gameId, String)

		var gameExists = GamePlayed.findOne({gameId: gameId, userId: userId}, {fields: {_id: 1, gameId: 1}})

		if(!gameExists){
			var date = new Date(); 
			GamePlayed.insert({
				dateCreated: date,
				userId: userId,
				gameId: gameId,
				coins: 10000,
				type: type,
				timeLimit: 20,
				diamonds: 0,
				matches: []
			});
		}
	}
});