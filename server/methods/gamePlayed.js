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

		var data = {
			coins: 10000,
			timeLimit: 20,
			diamonds: 0,
			matches: []
		}
		var gamePlayed = _.extend (data, gamePlayed)

		if(!gameExists){
			GamePlayed.insert(gamePlayed);
		}
	}
});
