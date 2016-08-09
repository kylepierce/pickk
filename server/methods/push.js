Meteor.methods({
	'questionPush': function(gameId, message) {
		check(gameId, String);
		check(message, String);

		const game = Games.findOne({_id: gameId});
		const userIds = game.nonActive;
		const text = "Guess What Happens on " + message;
		const users = Meteor.users.find({_id: {$in: userIds}}, {"oneSignalToken": 1}).fetch();
		const tokens = _.without(_.uniq(_.pluck(users, "oneSignalToken")), undefined);
		if (tokens.length) {
			if (Meteor.settings.oneSignal.isEnabled) {
				OneSignal.Notifications.create(tokens, {
					contents: {
						en: text
					},
					headings: {
						en: "Pickk question"
					},
					ios_badgeType: "Increase",
					ios_badgeCount: 1
				});
			}
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
		check(message, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		if (Meteor.settings.oneSignal.isEnabled) {
			OneSignal.Notifications.create(undefined, {
				included_segments: ["All"],
				contents: {
					en: message
				},
				headings: {
					en: "Pickk notification"
				},
				ios_badgeType: "Increase",
				ios_badgeCount: 1
			});
		}
	},

	'updateOneSignalToken': function (token) {
		// target device will be able to receive broadcast notifications but we can't send a message to it personally
		if (Meteor.user()) {
			Meteor.users.update(Meteor.userId(), {$set: {oneSignalToken: token}});
		}
	},

	'pushInvite': function(message, userId) {
		check(message, String);
		check(userId, String);

		var user = Meteor.users.findOne({_id: userId}, {"oneSignalToken": 1});
		if (user) {
			const token = user.oneSignalToken;
			if (token) {
				if (Meteor.settings.oneSignal.isEnabled) {
					OneSignal.Notifications.create([token], {
						contents: {
							en: message
						},
						headings: {
							en: "Pick invite"
						},
						ios_badgeType: "Increase",
						ios_badgeCount: 1
					});
				}
			}
		}
	}
});
