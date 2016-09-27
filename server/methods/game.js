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
			scheduled: timeCreated,
			gameDate: gameTime,
			name: title,
			football: true,
			status: "scheduled",
			manual: true,
			home: {
		    name: team1,
		    market: team1,
		    abbr: team1,
		    id: team1
		  },
		  away: {
		    name: team2,
		    market: team2,
		    abbr: team2,
		    id: team2
		  },
		  scoring: {
		    home: {
			    name: team1,
			    market: team1,
			    abbr: team1,
			    id: team1,
		      runs: "0"
		    },
		    away: {
			    name: team2,
			    market: team2,
			    abbr: team2,
			    id: team2,
		      runs: "0"
		    }
		  },
			tv: channel,
			commercial: false,
			completed: false,
			live: active,
			nonActive: [],
			users: []
		});
	},	

	'createPredictionGame': function() {
		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}
		var now = moment();
		var dateSpelled = moment(now,"MM/DD/YYYY", true).format("MMM Do YYYY");
		var title = dateSpelled + " Predictions"
		var timeCreated = new Date();
		var game = Games.insert({
			dateCreated: timeCreated,
			scheduled: timeCreated,
			type: "predictions",
			name: title,
			users: []
		});
		console.log("server", game)
		return game
	},	
	
	'deactivateGame': function(questionId) {
		check(questionId, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		Questions.update({_id: questionId}, {$set: {'active': "pending"}});
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