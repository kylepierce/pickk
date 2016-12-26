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

		var selector = {
			userId: gamePlayed.userId,
			gameId: gamePlayed.gameId,
			period: gamePlayed.period
		}

		var gameExists = GamePlayed.find(selector, {fields: {_id: 1, gameId: 1}}).fetch()

		var data = {
			coins: 10000,
			timeLimit: 20,
			diamonds: 0,
			matches: []
		}
		var gamePlayed = _.extend (data, gamePlayed)

		if(gameExists.length === 0){
			console.log("No bad code");
			GamePlayed.insert(gamePlayed);
		}
	}
});
