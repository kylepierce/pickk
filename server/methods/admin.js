Meteor.methods({
	'addTrophy': function(name, description, img) {
		check(name, String);
		check(description, String);
		check(img, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		var dateCreated = new Date();
		Trophies.insert({
			title: name,
			description: description,
			dateCreated: dateCreated,
			image: img
		});
	},

	'awardTrophy': function(trophyId, user) {
		check(trophyId, String);
		check(user, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		var timeCreated = new Date();
		UserList.update({_id: user}, {$push: {"profile.trophies": trophyId}})
	},

	// Way for Admin to manually update users coins
	'updateCoins': function(user, coins) {
		check(user, String);
		check(coins, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		var amount = parseInt(coins)
		Meteor.users.update({_id: user}, {$set: {"profile.coins": amount}});
	},

	'updateAllCoins': function(coins) {
		check(coins, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}
	},

	'updateCoins': function(user, coins, game) {
		check(user, String);
		check(coins, String);
		check(game, String);
		var amount = parseInt(coins)
		GamePlayed.update({userId: user, gameId: game}, {$set: {coins: amount}});
	},

// Way for Admin to manually update users name
	'updateName': function(user, name) {
		check(user, String);
		check(name, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		Meteor.users.update({_id: user}, {$set: {"profile.username": name}});
	},

	'resendVerifyEmail': function() {
		var testdata = Meteor.users.find({}, {sort: {dateCreated: -1}, limit: 3});
		testdata.forEach(function(item) {
			if (!item.emails[0].verified) {
				console.log(item._id, item.profile.username);
				Accounts.sendVerificationEmail(item._id);
			}
		});
		console.log("Email Sent!")
	},
	//Once the play starts change active status

	'deactivateStatus': function(questionId) {
		check(questionId, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		Questions.update({"_id": questionId}, {$set: {'active': null, "pending": true}});
	},
	'createHero': function (o) {
		check(o, Object);
		Hero.insert({
			startDate: o.startDate,
			endDate: o.endDate,
			liveStartDate: o.liveStartDate,
			liveEndDate: o.liveEndDate,
			button: o.button,
			text: o.text,
			buttonText: o.buttonText,
			active: o.active,
			image: o.image,
			url: o.url,
			important: o.important,
		});
	},
	'deleteCollection': function() {
		Multipliers.remove({})
	}
})