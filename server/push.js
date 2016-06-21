Meteor.methods({
		'questionPush': function(gameId, message) {
		const game = Games.findOne({_id: gameId});
		const userIds = game.nonActive;
		const text = "Guess What Happens on " + message;
		const users = Meteor.users.find({_id: {$in: userIds}}, {"oneSignalToken": 1}).fetch();
		const tokens = _.without(_.uniq(_.pluck(users, "oneSignalToken")), undefined);
		OneSignal.Notifications.create(tokens, {
			contents: {
				en: text
			},
			headings: {
				en: "Pickk question"
			}
		});
	},

	'emptyInactive': function(game) {
		var game = Games.findOne({_id: game})
		console.log("removing all users from inactive")
		var gameId = game._id
		return Games.update({_id: gameId}, {$set: {'nonActive': []}}, {multi: true});
	},

	'playerInactive': function(user, questionId) {
		var gameInfo = QuestionList.findOne({_id: questionId})
		var gameId = gameInfo.gameId
		var game = Games.find(
			{
				_id: gameId,
				nonActive: {$nin: [user]}
			}, {fields: {'nonActive': 1}}).fetch();
		if (game.length == 1) {
			Games.update(gameId, {$push: {nonActive: user}});
			console.log("added " + user + " to the inactive list")
		}
	},

	'push': function(message) {
		OneSignal.Notifications.create(undefined, {
			included_segments: ["All"],
			contents: {
				en: message
			},
			headings: {
				en: "Pickk notification"
			}
		});
	},

	'updateOneSignalToken': function (token) {
		// target device will be able to receive broadcast notifications but we can't send a message to it personally
		if (Meteor.user()) {
			Meteor.users.update(Meteor.userId(), {$set: {oneSignalToken: token}});
		}
	},

	'pushInvite': function(message, userId) {
		var user = Meteor.users.findOne({_id: userId}, {"oneSignalToken": 1});
		if (user) {
			const token = user.oneSignalToken;
			if (token) {
				OneSignal.Notifications.create([token], {
					contents: {
						en: message
					},
					headings: {
						en: "Pick invite"
					}
				});
			}
		}
	},
})