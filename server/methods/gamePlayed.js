Meteor.methods({
	'userJoinsAGame': function (userId, gameId) {
		check(userId, String)
		check(gameId, String)
		var gameExists = GamePlayed.findOne({gameId: gameId, userId: userId}, {fields: {_id: 1, gameId: 1}})
		if(!gameExists){
			var date = new Date(); 
			GamePlayed.insert({
				dateCreated: date,
				userId: user,
				gameId: game,
				coins: 10000,
				diamonds: 0,
				matches: []
			});
		}
	}
});