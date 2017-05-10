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
	'dismissInvitePrompt': function(gameId, userId){
		check(gameId, String);
		check(userId, String);
		Games.update({_id: gameId}, {$push: {dismissed: userId}});
	},

	'inviteToGame': function(gameId, userId, ref){
		check(gameId, Number);
		check(userId, String);
		check(ref, String);
		// Double check they arent in the invite section before sending push
		var game = Games.find({_id: gameId}).fetch()
		var invited = game[0].invited
		var users = game[0].users
		if(invited.indexOf(userId) === -1 && users.indexOf(userId) === -1 ){
			Games.update({_id: gameId}, {$addToSet: {invited: userId}});
			analytics.track("invited to game", {
        userId: ref,
        type: 'push',
        location: 'waiting screen',
        gameId: gameId,
        dateCreated: new Date()
      });

      var intercomData = {
        "last_shared_at": parseInt(Date.now() / 1000),
        "share_type": "push",
        "userId": ref,
      }
      updateIntercom(intercomData)

			Meteor.call('pushInviteToGame', gameId, userId, ref)
		} else {
			console.log("Looks like they are already invited ;)");
		}
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
			GamePlayed.insert(gamePlayed);
		}
	}
});
