Meteor.methods({
	'userJoinsAGame': function (user, game) {
		// check(user, String)
		var gameExists = GamePlayed.findOne({gameId: game}, {fields: {_id: 1}})
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