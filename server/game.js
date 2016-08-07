Meteor.methods({
	'createGame': function(team1, team2, title, active, channel, gameTime) {
		check(team1, String);
		check(team2, String);
		check(title, String);
		check(active, Boolean);		// CHECK - Boolean or String?
		check(channel, String);
		check(gameTime, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		var timeCreated = new Date();
		Games.insert({
			teams: [team1, team2],
			dateCreated: timeCreated,
			gameDate: gameTime,
			name: title,
			tv: channel,
			football: true,
			commercial: false,
			complete: false,
			live: active,
			nonActive: [],
			users: []
		});
	},	
	
	'deactivateGame': function(questionId) {
		check(questionId, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		Questions.update(questionId, {$set: {'active': "pending"}});
	},

	'activateGame': function(questionId) {
		check(questionId, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		Questions.update(questionId, {$set: {'active': true}});
	},
})