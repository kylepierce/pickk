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

	'updateProfile': function(username, firstName, lastName, birthday) {
		if (!this.userId) {
			return;
		}
		UserList.update(this.userId,
			{
				$set: {
					'profile.username': username,
					'profile.firstName': firstName,
					'profile.lastName': lastName,
					'profile.birthday': birthday
				}
			});
    var user = UserList.findOne(this.userId);
    mailChimpLists.subscribeUser(user, {double_optin: false}); // already sent double optin email upon sign up
	},

	// Update users info from the settings page

	'addTrophy': function(name, description, img) {
		Trophies.insert({
			title: name,
			description: description,
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

	'insertQuestion': function(game, que, commercial, op1, m1, op2, m2, op3, m3, op4, m4, op5, m5, op6, m6, active) {
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
			gameId: game,
			createdBy: currentUserId,
			dateCreated: timeCreated,
			active: active,
			commercial: commercial,
			options: {
				option1: {title: op1, usersPicked: [], multiplier: m1},
				option2: {title: op2, usersPicked: [], multiplier: m2},
				option3: {title: op3, usersPicked: [], multiplier: m3},
				option4: {title: op4, usersPicked: [], multiplier: m4},
				option5: {title: op5, usersPicked: [], multiplier: m5},
				option6: {title: op6, usersPicked: [], multiplier: m6},
			}
		});
	},

		'insertFourQuestion': function(game, que, commercial, op1, m1, op2, m2, op3, m3, op4, m4, active) {
		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		if (!active) {
			var active = true
		}

		// Insert the question into the database
		Questions.insert({
			que: que,
			gameId: game,
			createdBy: currentUserId,
			dateCreated: timeCreated,
			active: active,
			commercial: commercial,
			options: {
				option1: {title: op1, usersPicked: [], multiplier: m1},
				option2: {title: op2, usersPicked: [], multiplier: m2},
				option3: {title: op3, usersPicked: [], multiplier: m3},
				option4: {title: op4, usersPicked: [], multiplier: m4},
			}
		});
	},

	'createTrueFalse': function(que, game) {
		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		Questions.insert({
			que: que,
			gameId: game,
			createdBy: currentUserId,
			dateCreated: timeCreated,
			active: true,
			commercial: true,
			binaryChoice: true,
			options: {
				option1: {title: "True", usersPicked: []},
				option2: {title: "False", usersPicked: []},
			}

		})
	},

	'createTwoOption': function(game, que, option1, multiplier1, option2, multiplier2) {
		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		Questions.insert({
			que: que,
			gameId: game,
			createdBy: currentUserId,
			dateCreated: timeCreated,
			active: true,
			commercial: false,
			binaryChoice: true,
			options: {
				option1: {title: option1, multiplier: multiplier1, usersPicked: []},
				option2: {title: option2, multiplier: multiplier2, usersPicked: []},
			}

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

		var question = Questions.findOne({"_id": questionId});
		var option1 = question.options.option1.usersPicked
		var option2 = question.options.option2.usersPicked
		if (question.options.option3) {
			var option4 = question.options.option3.usersPicked
		}
		if (question.options.option4) {
			var option4 = question.options.option4.usersPicked
		}
		if (question.options.option5) {
			var option5 = question.options.option5.usersPicked
		}
		if (question.options.option6) {
			var option6 = question.options.option6.usersPicked
		}

		function awardPointsBack(user) {
			// Update users coins
			var amount = parseInt(user.amount)
			var userId = user.userID
			var timeCreated = new Date();
			var id = Random.id();
			var scoreMessage = "Play was removed. Here are your " + amount + " coins"
			Meteor.users.update({_id: userId}, {$inc: {"profile.coins": amount}})


			// Yeah this needs to be cleaned. I wanted to make sure it worked
			Meteor.users.update({_id: user.userID},
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

		// Loop over each option and award points wagered back.
		option1.map(function(user) {
			awardPointsBack(user)
		});
		option2.map(function(user) {
			awardPointsBack(user)
		});
		if (question.options.option3) {
			option3.map(function(user) {
				awardPointsBack(user)
			});
		}

		if (question.options.option4) {
			option4.map(function(user) {
				awardPointsBack(user)
			});
		}

		if (question.options.option5) {
			option5.map(function(user) {
				awardPointsBack(user)
			});
		}

		if (question.options.option6) {
			option6.map(function(user) {
				awardPointsBack(user)
			});
		}

	},

	// Once the play is over update what option it was. Then award points to those who guessed correctly.

	'modifyQuestionStatus': function(questionId, answer) {
		Questions.update(questionId, {$set: {active: false, play: answer}});

		var question = Questions.findOne({"_id": questionId});
		var option1 = question.options.option1.usersPicked
		var option1Title = question.options.option1.title
		var option2 = question.options.option2.usersPicked
		var option2Title = question.options.option2.title
		var option3 = question.options.option3.usersPicked
		var option3Title = question.options.option3.title
		var option4 = question.options.option4.usersPicked
		var option4Title = question.options.option4.title

		// If "op5" exists add the option to the end of the options object.
		if (question.options.option5) {
			var option5 = question.options.option5.usersPicked
			var option5Title = question.options.option5.title
		}

		if (question.options.option6) {
			var option6 = question.options.option6.usersPicked
			var option6Title = question.options.option6.title
		}

		var list = []

		function awardPoints(user, multiplier, title) {
			// Adjust multiplier based on when selected.
			var amount = parseInt(user.amount * multiplier)
			var timeCreated = new Date();
			var id = Random.id();
			var que = question.que
			var scoreMessage = "Nice Pickk! You got " + amount + " Coins!"
			var sharable = false
			if(amount > 10000){
				var shareMessage = "I Earned " + amount + " Coins! By Predicting '" + title + "' for '" + que + "'!"
				var sharable = true
			}
			// See if user is on list already
			var check = _.indexOf(list, user.userID)

			// If they are on the list exit the award process
			if (check !== -1) {
				console.log("Cant get double points for entering!")
				return
			}
			if (!shareMessage){
				var shareMessage = ""
			}
			// if they are not we are going to add them to the list.
			list.push(user.userID)

			Meteor.users.update({_id: user.userID},
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
			Meteor.users.update({_id: user.userID},
				{
					$inc: {"profile.coins": amount},
				})

			// Yeah this needs to be cleaned. I wanted to make sure it worked

		}

		// Can this be switch? Can it be refactored?
		if (answer == "option1") {
			option1.map(function(user) {
				var multiplier = parseFloat(question.options.option1.multiplier);
				var title = option1Title 
				awardPoints(user, multiplier, title)
			});
		} else if (answer == "option2") {
			option2.map(function(user) {
				var multiplier = parseFloat(question.options.option2.multiplier);
				var title = option2Title 
				awardPoints(user, multiplier, title)
			});
		} else if (answer == "option3") {
			option3.map(function(user) {
				var multiplier = parseFloat(question.options.option3.multiplier);
				var title = option3Title 
				awardPoints(user, multiplier, title);
			});
		} else if (answer == "option4") {
			option4.map(function(user) {
				var multiplier = parseFloat(question.options.option4.multiplier);
				var title = option4Title 
				awardPoints(user, multiplier, title);
			});
		} else if (answer == "option5") {
			option5.map(function(user) {
				var multiplier = parseFloat(question.options.option5.multiplier);
				var title = option5Title 
				awardPoints(user, multiplier, title);
			});
		} else if (answer == "option6") {
			option6.map(function(user) {
				var multiplier = parseFloat(question.options.option6.multiplier);
				var title = option6Title 
				awardPoints(user, multiplier, title);
			});
		}
	},

	'modifyTwoOptionQuestionStatus': function(questionId, answer) {
		Questions.update(questionId, {$set: {active: false, play: answer}});

		var question = Questions.findOne({"_id": questionId});
		var option1 = question.options.option1.usersPicked
		var option1Title = question.options.option1.title
		var option2 = question.options.option2.usersPicked
		var option2Title = question.options.option2.title

		var list = []

		function awardPoints(user, multiplier, title) {
			// Adjust multiplier based on when selected.
			var amount = parseInt(user.amount * multiplier)
			var timeCreated = new Date();
			var id = Random.id();
			var scoreMessage = "Nice Pickk! You got " + amount + " Coins!"
			var que = question.que
			var sharable = false
			if(amount > 10000){
				var shareMessage = "I Earned " + amount + " Coins! By Predicting '" + title + "' for '" + que + "'!"
				var sharable = true
			}

			// See if user is on list already
			var check = _.indexOf(list, user.userID)

			// If they are on the list exit the award process
			if (check !== -1) {
				console.log("Cant get double points for entering!")
				return
			}

			// if they are not we are going to add them to the list.
			list.push(user.userID)

			Meteor.users.update({_id: user.userID},
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
			Meteor.users.update({_id: user.userID},
				{
					$inc: {"profile.coins": amount},
				})

			// Yeah this needs to be cleaned. I wanted to make sure it worked

		}

		// Can this be switch? Can it be refactored?
		if (answer == "option1") {
			option1.map(function(user) {
				var multiplier = parseFloat(question.options.option1.multiplier);
				var title = option1Title
				awardPoints(user, multiplier, title)
			});
		} else if (answer == "option2") {
			option2.map(function(user) {
				var multiplier = parseFloat(question.options.option2.multiplier);
				var title = option2Title
				awardPoints(user, multiplier, title)
			});
		}
	},

	'modifyBinaryQuestionStatus': function(questionId, answer) {
		Questions.update(questionId, {$set: {active: false, play: answer}});

		var question = Questions.findOne({"_id": questionId});
		var option1 = question.options.option1.usersPicked
		var option2 = question.options.option2.usersPicked

		var list = []

		function awardPoints(user) {
			// Adjust multiplier based on when selected.
			var que = question.que
			var amount = parseInt(2000)
			var timeCreated = new Date();
			var id = Random.id();
			var scoreMessage = 'Nice Pickk! "' + que + '" 2000 Coins!'

			// See if user is on list already
			var check = _.indexOf(list, user.userID)

			// If they are on the list exit the award process
			if (check !== -1) {
				console.log("Cant get double points for entering!")
				return
			}

			// if they are not we are going to add them to the list.
			list.push(user.userID)

			Meteor.users.update({_id: user.userID},
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
			Meteor.users.update({_id: user.userID},
				{
					$inc: {"profile.coins": amount},
				})

			// Yeah this needs to be cleaned. I wanted to make sure it worked

		}

		// Can this be switch? Can it be refactored?
		if (answer == "option1") {
			option1.map(function(user) {
				awardPoints(user)
			});
		} else if (answer == "option2") {
			option2.map(function(user) {
				awardPoints(user)
			});
		}
	},

	'modifyGameQuestionStatus': function(questionId, answer) {
		Questions.update(questionId, {$set: {active: false, play: answer}});

		var question = Questions.findOne({"_id": questionId});
		var option1 = question.options.option1.usersPicked
		var option2 = question.options.option2.usersPicked
		var option3 = question.options.option3.usersPicked
		var option4 = question.options.option4.usersPicked
		var option5 = question.options.option5.usersPicked
		var option6 = question.options.option6.usersPicked

		var list = []

		var game = Questions.findOne({_id: questionId})

		function awardPoints(user) {
			// Adjust multiplier based on when selected.
			var amount = 10
			var timeCreated = new Date();
			var id = Random.id();
			var scoreMessage = "Nice Pickk on " + game.que + "! You Earned " + amount + " Diamonds!"

			// See if user is on list already
			var check = _.indexOf(list, user.userID)

			// If they are on the list exit the award process
			if (check !== -1) {
				console.log("Cant get double points for entering!")
				return
			}

			// if they are not we are going to add them to the list.
			list.push(user.userID)

			Meteor.users.update({_id: user.userID},
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
			Meteor.users.update({_id: user.userID},
				{
					$inc: {"profile.diamonds": amount},
				})

			// Yeah this needs to be cleaned. I wanted to make sure it worked

		}

		// Can this be switch? Can it be refactored?
		if (answer == "option1") {
			option1.map(function(user) {
				awardPoints(user)
			});
		} else if (answer == "option2") {
			option2.map(function(user) {
				awardPoints(user)
			});
		} else if (answer == "option3") {
			option3.map(function(user) {
				awardPoints(user);
			});
		} else if (answer == "option4") {
			option4.map(function(user) {
				awardPoints(user);
			});
		} else if (answer == "option5") {
			option5.map(function(user) {
				awardPoints(user);
			});
		} else if (answer == "option6") {
			option5.map(function(user) {
				awardPoints(user);
			});
		}
	},

// Remove Coins from the people who answered it "correctly", the answer changed. 

	'unAwardPoints': function(questionId, oldAnswer) {
		var question = Questions.findOne({"_id": questionId});
		var option1 = question.options.option1.usersPicked
		var option2 = question.options.option2.usersPicked
		var option3 = question.options.option3.usersPicked
		var option4 = question.options.option4.usersPicked
		var option5 = question.options.option5.usersPicked
		var option6 = question.options.option6.usersPicked

		function awardPoints(user, multiplier) {
			// Adjust multiplier based on when selected.

			var amount = parseInt(user.amount * multiplier)

			// Update users coins
			Meteor.users.update({_id: user.userID}, {
				$inc: {"profile.coins": -amount}
			})
		}

		// Can this be switch? Can it be refactored?
		if (oldAnswer == "option1") {
			option1.map(function(user) {
				var multiplier = parseFloat(question.options.option1.multiplier);
				awardPoints(user, multiplier)
			});
		} else if (oldAnswer == "option2") {
			option2.map(function(user) {
				var multiplier = parseFloat(question.options.option2.multiplier);
				awardPoints(user, multiplier)
			});
		} else if (oldAnswer == "option3") {
			option3.map(function(user) {
				var multiplier = parseFloat(question.options.option3.multiplier);
				awardPoints(user, multiplier);
			});
		} else if (oldAnswer == "option4") {
			option4.map(function(user) {
				var multiplier = parseFloat(question.options.option4.multiplier);
				awardPoints(user, multiplier);
			});
		} else if (oldAnswer == "option5") {
			option5.map(function(user) {
				var multiplier = parseFloat(question.options.option5.multiplier);
				awardPoints(user, multiplier);
			});
		} else if (oldAnswer == "option6") {
			option6.map(function(user) {
				var multiplier = parseFloat(question.options.option6.multiplier);
				awardPoints(user, multiplier);
			});
		}
	},

	'unAwardPointsForDelete': function(questionId, oldAnswer) {
		Questions.update(questionId, {$set: {active: false, play: "deleted"}});

		var question = Questions.findOne({"_id": questionId});
		var option1 = question.options.option1.usersPicked
		var option2 = question.options.option2.usersPicked
		var option3 = question.options.option3.usersPicked
		var option4 = question.options.option4.usersPicked
		var option5 = question.options.option5.usersPicked
		var option6 = question.options.option6.usersPicked

		function unAwardPoints(user, multiplier) {
			// Adjust multiplier based on when selected.
			var userAmount = user.amount
			var amount = parseInt(userAmount * multiplier)
			var scoreMessage = "Play overturned bummer :( " + amount + " Coins!"
			var timeCreated = new Date();
			var id = Random.id();

			// Update users coins
			Meteor.users.update({_id: user.userID}, {
				$inc: {"profile.coins": -amount}
			});

			Meteor.users.update({_id: user.userID},
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

		// Can this be switch? Can it be refactored?
		if (oldAnswer == "option1") {
			option1.map(function(user) {
				var multiplier = parseFloat(question.options.option1.multiplier);
				unAwardPoints(user, multiplier)
			});
		} else if (oldAnswer == "option2") {
			option2.map(function(user) {
				var multiplier = parseFloat(question.options.option2.multiplier);
				unAwardPoints(user, multiplier)
			});
		} else if (oldAnswer == "option3") {
			option3.map(function(user) {
				var multiplier = parseFloat(question.options.option3.multiplier);
				unAwardPoints(user, multiplier);
			});
		} else if (oldAnswer == "option4") {
			option4.map(function(user) {
				var multiplier = parseFloat(question.options.option4.multiplier);
				unAwardPoints(user, multiplier);
			});
		} else if (oldAnswer == "option5") {
			option5.map(function(user) {
				var multiplier = parseFloat(question.options.option5.multiplier);
				unAwardPoints(user, multiplier);
			});
		} else if (oldAnswer == "option6") {
			option6.map(function(user) {
				var multiplier = parseFloat(question.options.option6.multiplier);
				unAwardPoints(user, multiplier);
			});
		}
	},

	'awardInitalCoins': function(questionId) {
		var question = Questions.findOne({"_id": questionId});
		var option1 = question.options.option1.usersPicked
		var option2 = question.options.option2.usersPicked
		var option3 = question.options.option3.usersPicked
		var option4 = question.options.option4.usersPicked
		var option5 = question.options.option5.usersPicked
		var option6 = question.options.option6.usersPicked

		function awardPointsBack(user) {
			// Update users coins
			var amount = parseInt(user.amount)
			var userId = user.userID
			var timeCreated = new Date();
			var id = Random.id();
			var scoreMessage = "Play had removed. Here are your " + amount + " coins"
			Meteor.users.update({_id: userId}, {$inc: {"profile.coins": amount}})


			// Yeah this needs to be cleaned. I wanted to make sure it worked
			Meteor.users.update({_id: user.userID},
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

		// Loop over each option and award points wagered back.
		option1.map(function(user) {
			awardPointsBack(user)
		});
		option2.map(function(user) {
			awardPointsBack(user)
		});
		option3.map(function(user) {
			awardPointsBack(user)
		});
		option4.map(function(user) {
			awardPointsBack(user)
		});
		option5.map(function(user) {
			awardPointsBack(user)
		});
		option6.map(function(user) {
			awardPointsBack(user)
		});
	},

	// Users answered the question take away coins and add that info to their account.

	'questionAnswered': function(user, questionId, answer, wager, description) {
		// Grab the entire userAnswered array
		var question = Questions.find({_id: questionId},
			{fields: {'usersAnswered': 1}}).fetch();

		// Check if userId is in the usersAnswered array
		var userExists = _.indexOf(question, user)

		// If the user is already in the array exit this process
		if (userExists !== -1) {
			return
		}

		//Add question, wager and answer to the user's account.
		Meteor.users.update({_id: user},
			{
				$push: {
					questionAnswered: {
						questionId: questionId,
						wager: wager,
						answered: answer,
						description: description
					}
				}
			});

		// Update question with the user who have answered.
		Questions.update(questionId, {$push: {usersAnswered: user}});

		// Add user to the users who have played in the game.
		var gameInfo = Questions.findOne({_id: questionId})
		var game = Games.findOne({live: true});
		var gameId = game._id
		var game = Games.find(
			{
				_id: gameId,
				users: {$nin: [user]}
			}, {fields: {'users': 1}}).fetch();
		if (game.length == 1) {
			Games.update(gameId, {$push: {users: user}});
		}

		//Once a users has answered take the amount wager from their coins.
		Meteor.users.update({_id: user}, {$inc: {"profile.coins": -wager}});

		//Increase counter by 1
		Meteor.users.update({_id: user}, {$inc: {"profile.queCounter": +1}});

		var currentUser = Meteor.users.findOne({_id: user})
		var counter = currentUser.profile.queCounter

		if (counter === 1) {
			Meteor.call('awardDiamonds', user, 1)
		} else if (counter === 5) {
			Meteor.call('awardDiamonds', user, 2)
		} else if (counter === 25) {
			Meteor.call('awardDiamonds', user, 3)
		} else if (counter === 50) {
			Meteor.call('awardDiamonds', user, 4)
		} else if (counter === 75) {
			Meteor.call('awardDiamonds', user, 5)
		} else if (counter === 100) {
			Meteor.call('awardDiamonds', user, 7)
		} else if (counter === 140) {
			Meteor.call('awardDiamonds', user, 13)
		}

		// var question = Questions.findOne({"_id": questionId});
		// var option1 = question.options.option1.usersPicked
		// var option2 = question.options.option2.usersPicked
		// var option3 = question.options.option3.usersPicked
		// var option4 = question.options.option4.usersPicked
		// var option5 = question.options.option5.usersPicked
		// var option6 = question.options.option6.usersPicked

		//Update the question with the users answer and wager.
		if (answer == "option1") {
			Questions.update(questionId, {$push: {'options.option1.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option2") {
			Questions.update(questionId, {$push: {'options.option2.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option3") {
			Questions.update(questionId, {$push: {'options.option3.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option4") {
			Questions.update(questionId, {$push: {'options.option4.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option5") {
			Questions.update(questionId, {$push: {'options.option5.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option6") {
			Questions.update(questionId, {$push: {'options.option6.usersPicked': {userID: user, amount: wager}}});
		}
	},

	'twoOptionQuestionAnswered': function(user, questionId, answer, wager, que) {
		// Grab the entire userAnswered array
		var question = Questions.find({_id: questionId},
			{fields: {'usersAnswered': 1}}).fetch();

		// Check if userId is in the usersAnswered array
		var userExists = _.indexOf(question, user)

		// If the user is already in the array exit this process
		if (userExists !== -1) {
			return
		}

		//Add question, wager and answer to the user's account.
		Meteor.users.update({_id: user},
			{
				$push: {
					questionAnswered: {
						questionId: questionId,
						wager: wager,
						answered: answer,
						description: que
					}
				}
			});

		// Update question with the user who have answered.
		Questions.update(questionId, {$push: {usersAnswered: user}});

		// Add user to the users who have played in the game.
		console.log(questionId)
		var gameInfo = Questions.findOne({_id: questionId})
		console.log(gameInfo)
		var gameId = gameInfo.gameId
		var game = Games.find(
			{
				_id: gameId,
				users: {$nin: [user]}
			}, {fields: {'users': 1}}).fetch();
		if (game.length == 1) {
			Games.update(gameId, {$push: {users: user}});
		}

		//Once a users has answered take the amount wager from their coins.
		Meteor.users.update({_id: user}, {$inc: {"profile.coins": -wager}});

		//Increase counter by 1
		Meteor.users.update({_id: user}, {$inc: {"profile.queCounter": +1}});

		var currentUser = Meteor.users.findOne({_id: user})
		var counter = currentUser.profile.queCounter

		if (counter === 1) {
			Meteor.call('awardDiamonds', user, 1)
		} else if (counter === 5) {
			Meteor.call('awardDiamonds', user, 2)
		} else if (counter === 25) {
			Meteor.call('awardDiamonds', user, 3)
		} else if (counter === 50) {
			Meteor.call('awardDiamonds', user, 4)
		} else if (counter === 75) {
			Meteor.call('awardDiamonds', user, 5)
		} else if (counter === 100) {
			Meteor.call('awardDiamonds', user, 7)
		} else if (counter === 140) {
			Meteor.call('awardDiamonds', user, 13)
		}

		var question = Questions.findOne({"_id": questionId});
		var option1 = question.options.option1.usersPicked
		var option2 = question.options.option2.usersPicked

		//Update the question with the users answer and wager.
		if (answer == "option1") {
			Questions.update(questionId, {$push: {'options.option1.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option2") {
			Questions.update(questionId, {$push: {'options.option2.usersPicked': {userID: user, amount: wager}}});
		}
	},

	// Users answered the question take away coins and add that info to their account.

	'binaryQuestionAnswered': function(user, questionId, answer, que) {
		var timeCreated = new Date();
		var id = Random.id();
		var scoreMessage = "Thanks for Guessing! Here Are " + 500 + " Free Coins!"

		Meteor.users.update({_id: user},
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

		//Add question, wager and answer to the user's account.
		Meteor.users.update({_id: user}, {
			$push: {
				questionAnswered: {
					questionId: questionId,
					answered: answer, description: que
				}
			}
		});

		// Update question with the user who have answered.
		Questions.update(questionId, {$push: {usersAnswered: user}});

		// Add user to the users who have played in the game.
		var gameInfo = Questions.findOne({_id: questionId})
		var gameId = gameInfo.gameId
		var game = Games.find(
			{
				_id: gameId,
				users: {$nin: [user]}
			}, {fields: {'users': 1}}).fetch();
		if (game.length == 1) {
			Games.update(gameId, {$push: {users: user}});
		}

		//Once a users has answered take the amount wager from their coins.
		Meteor.users.update({_id: user}, {$inc: {"profile.coins": +500}});


		//Add question, wager and answer to the user's account.
		Meteor.users.update({_id: user}, {$push: {questionAnswered: {questionId: questionId, answered: answer}}});


		//Update the question with the users answer and wager.
		if (answer == "option1") {
			Questions.update(questionId, {$push: {'options.option1.usersPicked': {userID: user}}});
		} else if (answer == "option2") {
			Questions.update(questionId, {$push: {'options.option2.usersPicked': {userID: user}}});
		}
	},

	'gameQuestionAnswered': function(user, questionId, answer) {

		// Grab the entire userAnswered array
		var question = Questions.find({_id: questionId},
			{fields: {'usersAnswered': 1}}).fetch();

		// Check if userId is in the usersAnswered array
		var userExists = _.indexOf(question, user)

		// If the user is already in the array exit this process
		if (userExists !== -1) {
			return
		} else {

			// Update question with the user who have answered.
			Questions.update(questionId, {$push: {usersAnswered: user}});

			//Give user a diamond for answering
			Meteor.call('awardDiamonds', user, 5)

			//Add question and answer to the user's account.
			Meteor.users.update({_id: user}, {$push: {questionAnswered: {questionId: questionId, answered: answer}}});

			//Update the question with the users answer.
			if (answer == "option1") {
				Questions.update(questionId, {$push: {'options.option1.usersPicked': {userID: user}}});
			} else if (answer == "option2") {
				Questions.update(questionId, {$push: {'options.option2.usersPicked': {userID: user}}});
			} else if (answer == "option3") {
				Questions.update(questionId, {$push: {'options.option3.usersPicked': {userID: user}}});
			} else if (answer == "option4") {
				Questions.update(questionId, {$push: {'options.option4.usersPicked': {userID: user}}});
			} else if (answer == "option5") {
				Questions.update(questionId, {$push: {'options.option5.usersPicked': {userID: user}}});
			}
		}
	},

	'questionUnanswered': function(user, questionId, answer, wager) {
		// Remove user from the answer list
		Questions.update({_id: questionId}, {$pull: {usersAnswered: user}})

		//Remove question, wager and answer to the user's account.
		Meteor.users.update({_id: user}, {$pull: {questionAnswered: {questionId: questionId}}});

		//Update the question with the users answer and wager.
		if (answer == "option1") {
			Questions.update(questionId, {$pull: {'options.option1.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option2") {
			Questions.update(questionId, {$pull: {'options.option2.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option3") {
			Questions.update(questionId, {$pull: {'options.option3.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option4") {
			Questions.update(questionId, {$pull: {'options.option4.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option5") {
			Questions.update(questionId, {$pull: {'options.option5.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option6") {
			Questions.update(questionId, {$pull: {'options.option6.usersPicked': {userID: user, amount: wager}}});
		}

		//Once a users has removed question add wager to their coins.
		Meteor.users.update({_id: user}, {$inc: {"profile.coins": +wager}});
	},

	'isUsernameUnique': function(username) {
		username = username.trim()
		if (!username) {
			return true;
		}
		return !UserList.find({_id: {$ne: this.userId}, "profile.username": new RegExp("^" + escapeRegExp(username) + "$", "i")}).count()
	},

	'exportToMailChimp': function(limit) {
		limit = limit || 10; // safety net; pass a very high limit to export all users
		var user = UserList.findOne({_id: this.userId});
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
