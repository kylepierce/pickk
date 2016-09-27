Meteor.methods({
	'questionPush': function(gameId, message) {
		check(gameId, String);
		check(message, String);

		const game = Games.findOne({_id: gameId});
		const userIds = game.nonActive;
		const text = "Guess What Happens on " + message;
		if (userIds && userIds.length) {
			Push.send({
				from: 'Pickk',
				title: 'Pickk question',
				text: text,
				sound: 'default',
				badge: 1,
				query: {userId: {$in: userIds}}
			});
		}
	},

	'emptyInactive': function(gameId) {
		check(gameId, String);

		console.log("removing all users from inactive")
		return Games.update({_id: gameId}, {$set: {'nonActive': []}}, {multi: true});
	},

	'playerInactive': function(userId, questionId) {
		check(userId, String);
		check(questionId, String);

		var gameInfo = Questions.findOne({_id: questionId})
		var gameId = gameInfo.gameId
		var selector = {
				_id: gameId,
				nonActive: {$nin: [userId]}
			}
		var fields = {fields: {'nonActive': 1}}
		
		var game = Games.find(selector, fields).fetch();
		if (game.length == 1) {
			Games.update(gameId, {$push: {nonActive: userId}});
			console.log("added " + userId + " to the inactive list")
		}
	},

	'push': function(message) {
		check(message, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		Push.send({
			from: 'Pickk',
			title: 'Pickk notification',
			text: message,
			sound: 'default',
			badge: 1,
			query: {}
		});
	},

	'pushInvite': function(message, userId) {
		check(message, String);
		check(userId, String);

		var user = Meteor.users.findOne({_id: userId});
		if (user) {
			Push.send({
				from: 'Pickk',
				title: 'Pick invite',
				sound: 'default',
				text: message,
				badge: 1,
				query: {userId: userId}
			});
		}
	}
});
