Meteor.methods({
	'createGame': function(g) {
		check(g, Object);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		if (g.active === true){
			var status = "inprogress"
		} else {
			var status = "scheduled"
		}

		var home = Teams.findOne({"fullName": g.home});
		var away = Teams.findOne({"fullName": g.away});

		var homeAbbr = home.computerName
		var awayAbbr = away.computerName

		var title = g.away + " vs " + g.home
		var timeCreated = new Date();
		Games.insert({
			teams: [g.home, g.away],
			teamAbbr: ["nfl-" + homeAbbr.toLowerCase(), "nfl-" + awayAbbr.toLowerCase()],
			dateCreated: timeCreated,
			scheduled: timeCreated,
			name: title,
			football: true,
			status: status,
			manual: true,
			period: 1,
			sport: "football",
		  scoring: {
		    home: {
			    name: g.home,
			    market: g.home,
			    abbr: homeAbbr.toUpperCase(),
			    id: home._id,
		      runs: null
		    },
		    away: {
			    name: g.away,
			    market: g.away,
			    abbr: awayAbbr.toUpperCase(),
			    id: away._id,
		      runs: null
		    }
		  },
			tv: g.channel,
			commercial: false,
			completed: false,
			live: g.active,
			invited: [],
			registered: [],
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
	'updateGameScore': function(gameId, home, away){
		check(gameId, String);
		check(home, Number);
		check(away, Number);

		Games.update({_id: gameId},
			{$set: {
				"scoring.home.runs": home,
				"scoring.away.runs": away
			}
		});
	}
})
