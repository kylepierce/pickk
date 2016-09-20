Meteor.methods({
	'userExists': function(username) {
		check(username, String);
		return !!UserList.findOne({"profile.username": username});
	},

	'flushQuestions': function (){
		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}
		Questions.update({active: true}, {$set: {'active': false}}, {multi: true});
	},

	'toggleCommercial': function(gameId, toggle) {
		check(gameId, String);
		check(toggle, Boolean);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		Games.update({"_id": gameId}, {$set: {'commercial': toggle}});
	},

	// Create options
	'createOptions': function(inputs, type){
		check(inputs, Object);
		check(type, String);
		
		var down = parseInt(inputs.down)
		var area = parseInt(inputs.area)
		var time = parseInt(inputs.time)
		var yards = parseInt(inputs.yards)

		if ( type === "drive") {
			var optionArray = ["Punt", "Interception", "Fumble", "Touchdown", "Field Goal", "Safety", "Turnover on Downs"]
		} else if (down === 1) {
			var optionArray = ["Run", "Pass", "Interception", "Pick Six", "Fumble", "Touchdown"]
		} else if (down === 2) {
			var optionArray = ["Run", "Pass", "Interception", "Pick Six", "Fumble", "Touchdown"]
		} else if (down === 3 && area === 6) {
			var optionArray = ["Run", "Pass", "Pick Six", "Interception", "Fumble", "Touchdown"]
		} else if (down === 3) {
			var optionArray = ["Unable to Covert First Down", "Convert to First Down", "Pick Six", "Interception", "Fumble", "Touchdown"]
		} else if (down === 4 && area >= 4 ) {
			var optionArray = ["Kick Good!", "Run", "Pass", "Fumble", "Missed Kick", "Blocked Kick"]
		} else if (down === 4) {
			var optionArray = ["Fair Catch/No Return", "Neg to 20 Yard Return", "21-40 Yard Return", "Blocked Punt", "Fumble", "Touchdown"]
		} else if (down === 5) {
			var optionArray = ["Kick Good!", "Fake Kick No Score", "Blocked Kick", "Missed Kick", "Two Point Good", "Two Point No Good"]
		} else if (down === 6 && time === 5)  {
			var optionArray = ["Touchback/No Return", "Neg to 25 Yard Return",  "26+ Return", "Failed Onside", "Successful Onside", "Touchdown"]
		} else if (down === 6)  {
			var optionArray = ["Touchback/No Return", "Neg to 25 Yard Return",  "26-45 Return", "46+", "Fumble", "Touchdown"]
		}

		// Create the options of the play
		var options = {}
		var optionNum = 1

		optionArray.map(function (option){
			var optionNumber = "option" + optionNum
			options[optionNumber] = {"option": optionNumber, "title": option, multiplier: 3}
			optionNum += 1
		});

		return options
	},

	'addMultipliers': function ( inputs, options ) {
		check(inputs, Object);
		check(options, Object);
		var down = parseInt(inputs.down)
		var yards = parseInt(inputs.yards)
		var area = parseInt(inputs.area)

		var multiplier = Multipliers.findOne({down: down, yards: yards, area: area})

		return multiplier.options
	},

	'createMultipliers': function (inputs, existing){
		check(inputs, Object);
		check(existing, Object);

		Multipliers.update({
			down: inputs.down,
  		area: inputs.area,
  		yards: inputs.yards,
  		time: inputs.time
		}, {$set: {options: existing}}, {upsert: true}
		);

	},

	'questionText': function (inputs, type) {
		check(inputs, Object);
		check(type, String);

		var down = parseInt(inputs.down)
		switch (down){
			case 1: 
				var que = "First Down..."
				break;
			case 2: 
				var que = "Second Down..."
				break;
			case 3: 
				var que = "Third Down..."
				break;
			case 4: 
				var que = "Fourth Down..."
				break;
			case 5: 
				var que = "Point After..."
				break;
			case 6: 
				var que = "Kickoff..."
				break;
		}

		if ( type === "drive") {
			var que = "How Will This Drive End?"
		}

		return que
	},

	// Create a question.
	'insertQuestion': function(q) {
		check(q, Object);
			
		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}
		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		function randomizer(min, max){
			var multi = (Math.random() * (max-min) + min).toFixed(2)
			return multi
		}

		q["que"] = Meteor.call('questionText', q.inputs, q.type )
		var options = Meteor.call('createOptions', q.inputs, q.type )
		var multiplier = Meteor.call('addMultipliers', q.inputs, options )
		
		if ( q.type === "drive" ){
			var multiplier = { 
				option1: { low: 2.15, high: 2.37 }, // Punt
				option2: { low: 4.6, high: 6.42 }, // Interception
				option3: { low: 3.2, high: 4.81 }, // Fumble
				option4: { low: 3.4, high: 4.62 }, // Touchdown
				option5: { low: 2.2, high: 2.81 }, // Field Goal
				option6: { low: 15.9, high: 21.61 }, // Safety
				option7: { low: 5.4, high: 6.7 } // Safety
			}
		}

		console.log(multiplier)

		var newObject = Object.keys(multiplier).map(function(value, index) {
				var low = multiplier[value].low
				var high = multiplier[value].high
				return randomizer(low, high)
		});

		var counter = 0
		
		_.each(options, function (value, prop) {  
			options[prop].multiplier = newObject[counter]
		  counter += 1
		});

		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		// Insert the question into the database
		Questions.insert({
			que: q.que,
			gameId: q.gameId,
			createdBy: currentUserId,
			dateCreated: timeCreated,
			type: q.type,
			manual: true,
			active: true,
			commercial: q.commercial,
			options: options,
			usersAnswered: []
		});

		return q.que
	},

	'createTrueFalse': function(que, gameId) {
		check(que, String);
		check(gameId, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		Questions.insert({
			que: que,
			gameId: gameId,
			createdBy: currentUserId,
			dateCreated: timeCreated,
			type: "freePickk",
			active: true,
			manual: true,
			commercial: true,
			binaryChoice: true,
			options: {
				option1: {title: "True", multiplier: 4},
				option2: {title: "False", multiplier: 4},
			},
			usersAnswered: []
		})
	},

	'reactivateStatus': function(questionId) {
		check(questionId, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}
		Questions.update({_id: questionId}, {$set: {active: true}});
	},

	// If the play is stopped before it starts or needs to be deleted for whatever reason.
	'removeQuestion': function(questionId) {
		check(questionId, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		Questions.update({_id: questionId}, {$set: {active: false, outcome: "Removed"}});

		function awardPointsBack(a) {
			// Update users coins
			var amount = parseInt(a.wager)
			var scoreMessage = "Play was removed. Here are your " + amount + " coins"

			GamePlayed.update({userId: a.userId, gameId: a.gameId}, {$inc: {coins: amount}});

		  var notifyObj = {
		  	userId: a.userId,
				type: "coins",
				source: "removed",
				questionId: questionId,
				message: scoreMessage,
				value: amount,
				gameId: a.gameId,
		  }

		  createPendingNotification(notifyObj)
		}

		Answers.find({questionId: questionId}).forEach(awardPointsBack);
	},
	'readNotification': function(notifyId) {
    check(notifyId, String);

    var userId = Meteor.userId();
    UserList.update({_id: userId},
      {
        $pull: {
          pendingNotifications: {_id: notifyId}
        }
    })
  },
	// Remove Coins from the people who answered it "correctly", the answer changed.
	'unAwardPoints': function(questionId, oldAnswered) {
		check(questionId, String);
		check(oldAnswered, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		var question = Questions.findOne({"_id": questionId});

		function unAwardPoints(a) {
			// Adjust multiplier based on when selected.
			var amount = parseInt(a.wager * a.multiplier);

			// Update users coins
			var user = a.userId
			var game = a.gameId

			GamePlayed.update({userId: user, gameId: game}, {$inc: {coins: -amount}});

			var scoreMessage = "Play was overturned. " + amount + " coins were changed"

			var notifyObj = {
		  	userId: a.userId,
				type: "coins",
				source: "overturned",
				questionId: questionId,
				message: scoreMessage,
				value: amount,
				gameId: a.gameId,
		  }

		  createPendingNotification(notifyObj)
		}

		Answers.find({questionId: questionId, answered: oldAnswered}).forEach(unAwardPoints);
	},
});

	// 'unAwardPointsForDelete': function(questionId, oldAnswered) {
	// 	check(questionId, String);
	// 	check(oldAnswered, String);

	// 	if (!Meteor.userId()) {
 //      throw new Meteor.Error("not-signed-in", "Must be the logged in");
	// 	}

	// 	if (Meteor.user().profile.role !== "admin") {
 //      throw new Meteor.Error(403, "Unauthorized");
	// 	}

	// 	Questions.update(questionId, {$set: {active: false, play: "deleted"}});

	// 	var question = Questions.findOne({"_id": questionId});

	// 	function unAwardPoints(answer) {
	// 		// Adjust multiplier based on when selected.
	// 		var amount = parseInt(answer.wager * answer.multiplier);
	// 		var scoreMessage = "Play overturned. Bummer :(  Here are your " + amount + " Coins!"
	// 		var user = answer.userId
	// 		var game = answer.gameId
	// 		GamePlayed.update({userId: user, gameId: game}, {$inc: {coins: -amount}});

	// 	  var notifyObj = {
	// 	  	userId: user,
	// 			type: "coins",
	// 			message: scoreMessage,
	// 			questionId: ,
	// 			value: ,
	// 			amount: amount,
	// 			gameId: game,
	// 	  }

	// 	  createPendingNotification(notifyObj)
	// 	}

	// 	Answers.find({questionId: questionId, answered: oldAnswered}).forEach(unAwardPoints);
	// },

	// 	'awardInitalCoins': function(questionId) {
	// 	check(questionId, String);

	// 	if (!Meteor.userId()) {
 //      throw new Meteor.Error("not-signed-in", "Must be the logged in");
	// 	}

	// 	if (Meteor.user().profile.role !== "admin") {
 //      throw new Meteor.Error(403, "Unauthorized");
	// 	}

	// 	var question = Questions.findOne({"_id": questionId});

	// 	function awardPointsBack(answer) {
	// 		// Update users coins
	// 		var amount = parseInt(answer.wager)
	// 		var userId = answer.userId
	// 		var scoreMessage = "Play had removed. Here are your " + amount + " coins"
	// 		var user = answer.userId
	// 		var game = answer.gameId
	// 		GamePlayed.update({userId: user, gameId: game}, {$inc: {coins: amount}});

	// 	  var notifyObj = {
	// 	  	userId: user,
	// 			type: "coins",
	// 			message: scoreMessage,
	// 			amount: amount,
	// 			gameId: game,
	// 	  }

	// 	  createPendingNotification(notifyObj)
	// 	}

	// 	Answers.find({questionId: questionId}).forEach(awardPointsBack);
	// }