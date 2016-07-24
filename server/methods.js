Meteor.methods({
	'userExists': function(username) {
		return !!UserList.findOne({"profile.username": username});
	},

	'toggleCommercial': function(game, toggle) {
		Games.update(game, {$set: {'commercial': toggle}});
	},

	'createGame': function(team1, team2, title, active, channel, gameTime) {
		var timeCreated = new Date();
		Games.insert({
			teams: [team1, team2],
			dateCreated: timeCreated,
			gameDate: gameTime,
			name: title,
			tv: channel,
			commercial: false,
			complete: false,
			live: active,
			nonActive: [],
			users: []
		});
	},

	// Update users info from the settings page

	'updateProfile': function(username, firstName, lastName, birthday, timezone) {
		if (!this.userId) {
			return;
		}
		UserList.update(this.userId,
			{
				$set: {
					'profile.username': username,
					'profile.firstName': firstName,
					'profile.lastName': lastName,
					'profile.birthday': birthday,
					'profile.timezone': timezone
				}
			});
    var user = UserList.findOne(this.userId);
    mailChimpLists.subscribeUser(user, {double_optin: false}); // already sent double optin email upon sign up
	},

	// Update users Favorite teams info from the Favorite Teams page

	'updateFavoriteTeams': function(teamsArr) {
		if (!this.userId) {
			return;
		}

		UserList.update(this.userId,
			{
				$set: {'profile.favoriteTeams': teamsArr}
			});
		var user = UserList.findOne(this.userId);
		mailChimpLists.subscribeUser(user, {double_optin: false}); // already sent double optin email upon sign up
	},

	// Update users info from the settings page

	'addTrophy': function(name, description, img) {
		var dateCreated = new Date();
		Trophies.insert({
			title: name,
			description: description,
			dateCreated: dateCreated,
			image: img
		});
	},

	'awardTrophy': function(trophyId, user) {
		var timeCreated = new Date();
		UserList.update({_id: user}, {$push: {"profile.trophies": trophyId}})
	},

	'notifyTrophyAwarded': function(trophyId, user) {
		var timeCreated = new Date();
		var id = Random.id();
		UserList.update({_id: user},
			{
				$push: {
					pendingNotifications: {
						_id: id,
						type: "trophy",
						notificationId: trophyId,
						dateCreated: timeCreated
					}
				}
			}
		);
	},

	'removeNotification': function(notifyId) {
		var user = Meteor.userId()
		UserList.update({_id: user},
			{
				$pull: {
					pendingNotifications: {_id: notifyId}
				}
			})
	},

	'readNotification': function(notifyId) {
		var userId = Meteor.userId()
		UserList.update({_id: userId},
			{
				$pull: {
					pendingNotifications: {_id: notifyId}
				}
			})
	},
	// Way for Admin to manually update users coins

	'updateCoins': function(user, coins) {
		var amount = parseInt(coins)
		Meteor.users.update({_id: user}, {$set: {"profile.coins": amount}});
	},

	'updateAllCoins': function(coins) {
		var amount = parseInt(coins)
		UserList.update({}, {$set: {"profile.coins": amount}}, {multi: true});
	},

// Way for Admin to manually update users name
	'updateName': function(user, name) {
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


	// Create a question. Each play has question text and six options.

	'insertQuestion': function(gameId, que, commercial, op1, m1, op2, m2, op3, m3, op4, m4, op5, m5, op6, m6, active) {
		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		if (!active) {
			var active = true
		}

		// If there less than 6 options we will set the other options to nothing.
		op5 = op5 || '';
		m5 = m5 || '';
		op6 = op6 || '';
		m6 = m6 || '';

		// Insert the question into the database
		Questions.insert({
			que: que,
			gameId: gameId,
			createdBy: currentUserId,
			dateCreated: timeCreated,
			active: active,
			commercial: commercial,
			options: {
				option1: {title: op1, multiplier: m1},
				option2: {title: op2, multiplier: m2},
				option3: {title: op3, multiplier: m3},
				option4: {title: op4, multiplier: m4},
				option5: {title: op5, multiplier: m5},
				option6: {title: op6, multiplier: m6},
			},
			usersAnswered: []
		});
	},

		'insertFourQuestion': function(gameId, que, commercial, op1, m1, op2, m2, op3, m3, op4, m4, active) {
		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		if (!active) {
			var active = true
		}

		// Insert the question into the database
		Questions.insert({
			que: que,
			gameId: gameId,
			createdBy: currentUserId,
			dateCreated: timeCreated,
			active: active,
			commercial: commercial,
			options: {
				option1: {title: op1, multiplier: m1},
				option2: {title: op2, multiplier: m2},
				option3: {title: op3, multiplier: m3},
				option4: {title: op4, multiplier: m4},
			},
			usersAnswered: []
		});
	},

	'createTrueFalse': function(que, gameId) {
		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		Questions.insert({
			que: que,
			gameId: gameId,
			createdBy: currentUserId,
			dateCreated: timeCreated,
			active: true,
			commercial: true,
			binaryChoice: true,
			options: {
				option1: {title: "True"},
				option2: {title: "False"},
			},
			usersAnswered: []
		})
	},

	'createTwoOption': function(gameId, que, option1, multiplier1, option2, multiplier2) {
		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		Questions.insert({
			que: que,
			gameId: gameId,
			createdBy: currentUserId,
			dateCreated: timeCreated,
			active: true,
			commercial: false,
			binaryChoice: true,
			options: {
				option1: {title: option1, multiplier: multiplier1},
				option2: {title: option2, multiplier: multiplier2},
			},
			usersAnswered: []
		})
	},

	'loadLeaderboard': function() {
		var liveGame = Games.findOne({live: true});
		if (liveGame) {
			var selector = {_id: {$in: liveGame.users}}
			return UserList.find(
				selector,
				{
					fields: {
						'profile.username': 1,
						'profile.coins': 1,
						'profile.avatar': 1,
						'_id': 1
					}
				}).fetch();
		} else {
			return [];
		}
	},

	'loadWeekLeaderboard': function() {
		return UserList.find(
			{"profile.diamonds": {$gt: 0}},
			{
				fields: {
					'profile.username': 1,
					'profile.diamonds': 1,
					'profile.avatar': 1,
					'_id': 1
				}
			}).fetch();

	},



	//Once the play starts change active status

	'deactivateStatus': function(questionId) {
		Questions.update(questionId, {$set: {'active': null}});
	},

	'reactivateStatus': function(questionId) {
		Questions.update(questionId, {$set: {'active': true}});
	},

	'deactivateGame': function(questionId) {
		Questions.update(questionId, {$set: {'active': "pending"}});
	},

	'activateGame': function(questionId) {
		Questions.update(questionId, {$set: {'active': true}});
	},

	// If the play is stopped before it starts or needs to be deleted for whatever reason.

	'removeQuestion': function(questionId) {
		Questions.update(questionId, {$set: {active: false, play: "deleted"}});

		function awardPointsBack(answer) {
			// Update users coins
			var amount = parseInt(answer.wager)
			var userId = answer.userId
			var timeCreated = new Date();
			var id = Random.id();
			var scoreMessage = "Play was removed. Here are your " + amount + " coins"
			Meteor.users.update({_id: userId}, {$inc: {"profile.coins": amount}})


			// Yeah this needs to be cleaned. I wanted to make sure it worked
			Meteor.users.update({_id: answer.userId},
				{
					$push: {
						pendingNotifications: {
							_id: id,
							type: "score",
							read: false,
							notificationId: id,
							dateCreated: timeCreated,
							message: scoreMessage
						}
					}
				}
			)


		}

		Answers.find({questionId: questionId}).forEach(awardPointsBack);
	},

	// Once the play is over update what option it was. Then award points to those who guessed correctly.

	'modifyQuestionStatus': function(questionId, answered) {
		Questions.update(questionId, {$set: {active: false, play: answered}});

		var question = Questions.findOne({"_id": questionId});

		var list = []

		function awardPoints(answer) {
			// Adjust multiplier based on when selected.
			var amount = parseInt(answer.wager * answer.multiplier);
			var timeCreated = new Date();
			var id = Random.id();
			var que = question.que
			var scoreMessage = "Nice Pickk! You got " + amount + " Coins!"
			var sharable = false
			if(amount > 10000){
				var shareMessage = "I Earned " + amount + " Coins! By Predicting '" + answer.description + "' for '" + que + "'!"
				var sharable = true
			}
			// See if user is on list already
			var check = _.indexOf(list, answer.userId)

			// If they are on the list exit the award process
			if (check !== -1) {
				console.log("Cant get double points for entering!")
				return
			}
			if (!shareMessage){
				var shareMessage = ""
			}
			// if they are not we are going to add them to the list.
			list.push(answer.userId)

			Meteor.users.update({_id: answer.userId},
				{
					$push: {
						pendingNotifications: {
							_id: id,
							type: "score",
							read: false,
							notificationId: id,
							dateCreated: timeCreated,
							message: scoreMessage,
							sharable: sharable,
							shareMessage: shareMessage
						}
					}
				}
			)

			// Update users coins
			Meteor.users.update({_id: answer.userId},
				{
					$inc: {"profile.coins": amount},
				})

			// Yeah this needs to be cleaned. I wanted to make sure it worked

		}

		Answers.find({questionId: questionId, answered: answered}).forEach(awardPoints);
	},

	'modifyTwoOptionQuestionStatus': function(questionId, answered) {
		Questions.update(questionId, {$set: {active: false, play: answered}});

		var question = Questions.findOne({"_id": questionId});

		var list = []

		function awardPoints(answer) {
			// Adjust multiplier based on when selected.
			var amount = parseInt(answer.wager * answer.multiplier)
			var timeCreated = new Date();
			var id = Random.id();
			var scoreMessage = "Nice Pickk! You got " + amount + " Coins!"
			var que = question.que
			var sharable = false
			if(amount > 10000){
				var shareMessage = "I Earned " + amount + " Coins! By Predicting '" + answer.description + "' for '" + que + "'!"
				var sharable = true
			}

			// See if user is on list already
			var check = _.indexOf(list, answer.userId)

			// If they are on the list exit the award process
			if (check !== -1) {
				console.log("Cant get double points for entering!")
				return
			}

			// if they are not we are going to add them to the list.
			list.push(answer.userId)

			Meteor.users.update({_id: answer.userId},
				{
					$push: {
						pendingNotifications: {
							_id: id,
							type: "score",
							read: false,
							notificationId: id,
							dateCreated: timeCreated,
							message: scoreMessage,
							sharable: sharable,
							shareMessage: shareMessage
						}
					}
				}
			)

			// Update users coins
			Meteor.users.update({_id: answer.userId},
				{
					$inc: {"profile.coins": amount},
				})

			// Yeah this needs to be cleaned. I wanted to make sure it worked

		}

		Answers.find({questionId: questionId, answered: answered}).forEach(awardPoints);
	},

	'modifyBinaryQuestionStatus': function(questionId, answered) {
		Questions.update(questionId, {$set: {active: false, play: answered}});

		var question = Questions.findOne({"_id": questionId});

		var list = []

		function awardPoints(answer) {
			// Adjust multiplier based on when selected.
			var que = question.que
			var amount = parseInt(2000)
			var timeCreated = new Date();
			var id = Random.id();
			var scoreMessage = 'Nice Pickk! "' + que + '" 2000 Coins!'

			// See if user is on list already
			var check = _.indexOf(list, answer.userId)

			// If they are on the list exit the award process
			if (check !== -1) {
				console.log("Cant get double points for entering!")
				return
			}

			// if they are not we are going to add them to the list.
			list.push(answer.userId)

			Meteor.users.update({_id: answer.userId},
				{
					$push: {
						pendingNotifications: {
							_id: id,
							type: "score",
							read: false,
							notificationId: id,
							dateCreated: timeCreated,
							message: scoreMessage
						}
					}
				}
			)

			// Update users coins
			Meteor.users.update({_id: answer.userId},
				{
					$inc: {"profile.coins": amount},
				})

			// Yeah this needs to be cleaned. I wanted to make sure it worked

		}

		Answers.find({questionId: questionId, answered: answered}).forEach(awardPoints);
	},

	'modifyGameQuestionStatus': function(questionId, answered) {
		Questions.update(questionId, {$set: {active: false, play: answered}});

		var question = Questions.findOne({"_id": questionId});

		var list = []

		function awardPoints(user) {
			// Adjust multiplier based on when selected.
			var amount = 10
			var timeCreated = new Date();
			var id = Random.id();
			var scoreMessage = "Nice Pickk on " + question.que + "! You Earned " + amount + " Diamonds!"

			// See if user is on list already
			var check = _.indexOf(list, user.userId)

			// If they are on the list exit the award process
			if (check !== -1) {
				console.log("Cant get double points for entering!")
				return
			}

			// if they are not we are going to add them to the list.
			list.push(user.userId)

			Meteor.users.update({_id: user.userId},
				{
					$push: {
						pendingNotifications: {
							_id: id,
							type: "diamonds",
							read: false,
							notificationId: id,
							dateCreated: timeCreated,
							message: scoreMessage
						}
					}
				}
			)

			// Update users diamonds
			Meteor.users.update({_id: user.userId},
				{
					$inc: {"profile.diamonds": amount},
				})

			// Yeah this needs to be cleaned. I wanted to make sure it worked

		}

		Answers.find({questionId: questionId, answered: answered}).forEach(awardPoints);
	},

// Remove Coins from the people who answered it "correctly", the answer changed.

	'unAwardPoints': function(questionId, oldAnswered) {
		var question = Questions.findOne({"_id": questionId});

		function unAwardPoints(answer) {
			// Adjust multiplier based on when selected.

			var amount = parseInt(answer.wager * answer.multiplier);

			// Update users coins
			Meteor.users.update({_id: answer.userId}, {
				$inc: {"profile.coins": -amount}
			})
		}

		Answers.find({questionId: questionId, answered: oldAnswered}).forEach(unAwardPoints);
	},

	'unAwardPointsForDelete': function(questionId, oldAnswered) {
		Questions.update(questionId, {$set: {active: false, play: "deleted"}});

		var question = Questions.findOne({"_id": questionId});

		function unAwardPoints(answer) {
			// Adjust multiplier based on when selected.
			var amount = parseInt(answer.wager * answer.multiplier);
			var scoreMessage = "Play overturned bummer :( " + amount + " Coins!"
			var timeCreated = new Date();
			var id = Random.id();

			// Update users coins
			Meteor.users.update({_id: answer.userId}, {
				$inc: {"profile.coins": -amount}
			});

			Meteor.users.update({_id: answer.userId},
				{
					$push: {
						pendingNotifications: {
							_id: id,
							type: "score",
							read: false,
							notificationId: id,
							dateCreated: timeCreated,
							message: scoreMessage
						}
					}
				}
			)
		}

		Answers.find({questionId: questionId, answered: oldAnswered}).forEach(unAwardPoints);
	},

	'awardInitalCoins': function(questionId) {
		var question = Questions.findOne({"_id": questionId});

		function awardPointsBack(answer) {
			// Update users coins
			var amount = parseInt(answer.wager)
			var userId = answer.userId
			var timeCreated = new Date();
			var id = Random.id();
			var scoreMessage = "Play had removed. Here are your " + amount + " coins"
			Meteor.users.update({_id: userId}, {$inc: {"profile.coins": amount}})


			// Yeah this needs to be cleaned. I wanted to make sure it worked
			Meteor.users.update({_id: answer.userId},
				{
					$push: {
						pendingNotifications: {
							_id: id,
							type: "score",
							read: false,
							notificationId: id,
							dateCreated: timeCreated,
							message: scoreMessage
						}
					}
				}
			)
		}

		Answers.find({questionId: questionId}).forEach(awardPointsBack);
	},

	'questionAnswered': function(questionId, answered, wager, description) {
		var question = Questions.findOne(questionId);

		if (~question.usersAnswered.indexOf(this.userId)) {
			return
		}

		var option = question.options[answered];
		if (!option) {
			throw new Meteor.Error("Can't find the option '" + answered + "' for question #" + questionId)
		}

		wager = parseInt(wager || "0", 10);
		description = description || "";
		var multiplier = parseFloat(option.multiplier || "0");

    Answers.insert({
			userId: this.userId,
			gameId: question.gameId,
			questionId: questionId,
			answered: answered,
			wager: wager,
			multiplier: multiplier,
			description: description
		});

		// Update question with the user who have answered.
		Questions.update(questionId, {$addToSet: {usersAnswered: this.userId}});

		Games.update({live: true}, {$addToSet: {users: this.userId}});

		//Once a users has answered take the amount wager from their coins.
		Meteor.users.update(this.userId, {$inc: {"profile.coins": -wager}});

		//Increase counter by 1
		Meteor.users.update(this.userId, {$inc: {"profile.queCounter": +1}});

		var currentUser = Meteor.users.findOne(this.userId)
		var counter = currentUser.profile.queCounter

		if (counter === 1) {
			Meteor.call('awardDiamonds', this.userId, 1)
		} else if (counter === 5) {
			Meteor.call('awardDiamonds', this.userId, 2)
		} else if (counter === 25) {
			Meteor.call('awardDiamonds', this.userId, 3)
		} else if (counter === 50) {
			Meteor.call('awardDiamonds', this.userId, 4)
		} else if (counter === 75) {
			Meteor.call('awardDiamonds', this.userId, 5)
		} else if (counter === 100) {
			Meteor.call('awardDiamonds', this.userId, 7)
		} else if (counter === 140) {
			Meteor.call('awardDiamonds', this.userId, 13)
		}
	},

	'twoOptionQuestionAnswered': function(questionId, answered, wager, description) {
		var question = Questions.findOne(questionId);

		if (~question.usersAnswered.indexOf(this.userId)) {
			return
		}

		var option = question.options[answered];
		if (!option) {
			throw new Meteor.Error("Can't find the option '" + answered + "' for question #" + questionId)
		}

		wager = parseInt(wager || "0", 10);
		description = description || "";
		var multiplier = parseFloat(option.multiplier || "0");

		Answers.insert({
			userId: this.userId,
			gameId: question.gameId,
			questionId: questionId,
			answered: answered,
			wager: wager,
			multiplier: multiplier,
			description: description
		});

		// Update question with the user who have answered.
		Questions.update(questionId, {$addToSet: {usersAnswered: this.userId}});

		// Add user to the users who have played in the game.
		Games.update(question.gameId, {$addToSet: {users: this.userId}});

		//Once a users has answered take the amount wager from their coins.
		Meteor.users.update(this.userId, {$inc: {"profile.coins": -wager}});

		//Increase counter by 1
		Meteor.users.update(this.userId, {$inc: {"profile.queCounter": +1}});

		var currentUser = Meteor.users.findOne(this.userId)
		var counter = currentUser.profile.queCounter

		if (counter === 1) {
			Meteor.call('awardDiamonds', this.userId, 1)
		} else if (counter === 5) {
			Meteor.call('awardDiamonds', this.userId, 2)
		} else if (counter === 25) {
			Meteor.call('awardDiamonds', this.userId, 3)
		} else if (counter === 50) {
			Meteor.call('awardDiamonds', this.userId, 4)
		} else if (counter === 75) {
			Meteor.call('awardDiamonds', this.userId, 5)
		} else if (counter === 100) {
			Meteor.call('awardDiamonds', this.userId, 7)
		} else if (counter === 140) {
			Meteor.call('awardDiamonds', this.userId, 13)
		}
	},

	'binaryQuestionAnswered': function(questionId, answered, wager, description) {
		var question = Questions.findOne(questionId);

		if (~question.usersAnswered.indexOf(this.userId)) {
			return
		}

		var option = question.options[answered];
		if (!option) {
			throw new Meteor.Error("Can't find the option '" + answered + "' for question #" + questionId)
		}

		wager = parseInt(wager || "0", 10);
		description = description || "";
		var multiplier = parseFloat(option.multiplier || "0");

		Answers.insert({
			userId: this.userId,
			gameId: question.gameId,
			questionId: questionId,
			answered: answered,
			wager: wager,
			multiplier: multiplier,
			description: description
		});

		// Update question with the user who have answered.
		Questions.update(questionId, {$addToSet: {usersAnswered: this.userId}});

		// Add user to the users who have played in the game.
		Games.update(question.gameId, {$addToSet: {users: this.userId}});

		//Once a users has answered take the amount wager from their coins.
		Meteor.users.update(this.userId, {$inc: {"profile.coins": +wager}});

		var timeCreated = new Date();
		var id = Random.id();
		var scoreMessage = "Thanks for Guessing! Here Are " + wager + " Free Coins!"

		Meteor.users.update(this.userId,
			{
				$push: {
					pendingNotifications: {
						_id: id,
						type: "score",
						read: false,
						notificationId: id,
						dateCreated: timeCreated,
						message: scoreMessage
					}
				}
			}
		)
	},

	'gameQuestionAnswered': function(questionId, answered, wager, description) {
		var question = Questions.findOne(questionId);

		if (~question.usersAnswered.indexOf(this.userId)) {
			return
		}

		var option = question.options[answered];
		if (!option) {
			throw new Meteor.Error("Can't find the option '" + answered + "' for question #" + questionId)
		}

		wager = parseInt(wager || "0", 10);
		description = description || "";
		var multiplier = parseFloat(option.multiplier || "0");

		Answers.insert({
			userId: this.userId,
			gameId: question.gameId,
			questionId: questionId,
			answered: answered,
			wager: wager,
			multiplier: multiplier,
			description: description
		});

		// Update question with the user who have answered.
		Questions.update(questionId, {$addToSet: {usersAnswered: this.userId}});

		//Give user a diamond for answering
		Meteor.call('awardDiamonds', this.userId, 5);
	},

	'isUsernameUnique': function(username) {
		username = username.trim()
		if (!username) {
			return true;
		}
		return !UserList.find({_id: {$ne: this.userId}, "profile.username": new RegExp("^" + escapeRegExp(username) + "$", "i")}).count()
	},
	'isGroupNameUnique': function(name) {
		name = name.trim()
		if (!name) {
			return true;
		}
		return !Groups.find({groupId: {$ne: name}}).count()
	},
	'exportToMailChimp': function(limit) {
		limit = limit || 10; // safety net; pass a very high limit to export all users
		var user = UserList.findOne(this.userId);
		var role = user.profile.role;
		if (role !== "admin") {
			throw new Meteor.Error(403, "Unauthorized");
		}
		var selector = {"emails.address": {$exists: true}};
		var options = {sort: {_id: 1}, limit: limit};
		UserList.find(selector, options).forEach(function(user) {
			console.info("[exportToMailChimp] Subscribing " + user.emails[0].address + " (" + user._id + ")");
			mailChimpLists.subscribeUser(user, {double_optin: false}, function(error, result) {
				if (error) {
					console.error("[exportToMailChimp] Error for " + user.emails[0].address + ": " + JSON.stringify(error));
				} else {
					console.info("[exportToMailChimp] Result for " + user.emails[0].address + ": " + JSON.stringify(result));
				}
			});
		});
	}
});
