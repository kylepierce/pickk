Meteor.methods({
	'userExists': function(username) {
		return !!UserList.findOne({"profile.username": username});
	},

	'addChatMessage': function(author, messagePosted, groupId) {
		var timeCreated = new Date();
		var id = Random.id();
		var messagePosted = messagePosted.replace(/<\/?[^>]+(>|$)/g, "");
		if (messagePosted[0] == "[") {
			switch (messagePosted) {
				case "[dead]":
					var messagePosted = "<img src='/emoji/Full-Color/Emoji-Party-Pack-01.svg'>"
					break;
				case "[omg]":
					var messagePosted = "<img src='/emoji/Full-Color/Emoji-Party-Pack-01.svg'>"
					break;
				case "[fire]":
					var messagePosted = "<img src='/emoji/Full-Color/Emoji-Party-Pack_Artboard%20119.svg'>"
					break;
				case "[dying]":
					var messagePosted = "<img src='/emoji/Full-Color/Emoji-Party-Pack-13.svg'>"
					break;
				case "[hell-yeah]":
					var messagePosted = "<img src='/emoji/Full-Color/Emoji-Party-Pack_Artboard%20109.svg'>"
					break;
				case "[what]":
					var messagePosted = "<img src='/emoji/Full-Color/Emoji-Party-Pack_Artboard%20112.svg'>"
					break;
				case "[pirate]":
					var messagePosted = "<img src='/emoji/Full-Color/Emoji-Party-Pack-24.svg'>"
					break;
				case "[love]":
					var messagePosted = "<img src='/emoji/Full-Color/Emoji-Party-Pack-58.svg'>"
					break;
				case "[tounge]":
					var messagePosted = "<img src='/emoji/Full-Color/Emoji-Party-Pack-86.svg'>"
					break;
				case "[oh-no]":
					var messagePosted = "<img src='/emoji/Full-Color/Emoji-Party-Pack-93.svg'>"
					break;
				case "[what-the-hell]":
					var messagePosted = "<img src='/emoji/Full-Color/Emoji-Party-Pack-96.svg'>"
					break;
			}
		} else if (messagePosted == "" || messagePosted == null) {
			var messagePosted = "<i>Removed</i>"
		}

		Chat.insert({
			_id: id,
			dateCreated: timeCreated,
			group: groupId,
			user: author,
			message: messagePosted
		});
	},

	'updateAllCounters': function(user) {
		var user = UserList.findOne({_id: user})
		var role = user.profile.role
		if (role === "admin") {
			UserList.update({}, {$set: {"profile.queCounter": 0}}, {multi: true})
		}
	},

	'updateAllDiamonds': function(user) {
		var user = UserList.findOne({_id: user})
		var role = user.profile.role
		if (role === "admin") {
			UserList.update({}, {$set: {"profile.diamonds": 0}}, {multi: true})
		}
	},


	'coinMachine': function() {
		var userIds = _.pluck(Meteor.users.find({}, {
			fields: {
				_id: 1,
				"profile.coins": 1,
				"profile.diamonds": 1
			}
		}).fetch(), '_id');

		userIds.forEach(function(item) {
			var user = UserList.findOne({_id: item});
			var coins = user.profile.coins
			var exchange = "exchange"
			if (coins === 10000) {

			}
			if (coins < 10000) {
				var diamondExchange = coins / 2500
				diamondExchange = Math.floor(diamondExchange)
				var message = "You traded " + coins + " coins for " + diamondExchange + ' diamonds'
				Meteor.call('awardDiamondsCustom', item, diamondExchange, message, exchange)
				Meteor.users.update({_id: item}, {$set: {"profile.coins": 0}});
			}
			if (coins > 10001) {
				var diamondExchange = coins / 7500
				diamondExchange = Math.floor(diamondExchange)
				var message = "You traded " + coins + " coins for " + diamondExchange + ' diamonds'
				Meteor.call('awardDiamondsCustom', item, diamondExchange, message, exchange)
				Meteor.users.update({_id: item}, {$set: {"profile.coins": 0}});
			}
		});
	},

	'awardLeaders': function(user) {
		var liveGame = Games.findOne({live: true});
		var selector = {_id: {$in: liveGame.users}}
		var leaderboard = UserList.find(
			selector,
			{
				fields: {
					'profile.username': 1,
					'profile.coins': 1,
					'profile.avatar': 1,
					'_id': 1
				}
			}, {sort: {'profile.coins': -1}}).fetch();
		var fixed = _.sortBy(leaderboard, function(obj) {
			return obj.profile.coins
		})
		fixed.reverse()

		function awardTrophies(trophyId, user) {
			Meteor.call('awardTrophy', trophyId, user);
			Meteor.call('notifyTrophyAwarded', trophyId, user);
		}

		var user = UserList.findOne({_id: user})
		var role = user.profile.role
		if (role === "admin") {
			awardTrophies('xNMMTjKRrqccnPHiZ', fixed[0]._id)

			Meteor.call('awardDiamondsCustom', fixed[0]._id, 50, '<img style="max-width:100%;" src="/1st.png"> <br>Congrats On Winning First Place Here is 50 Diamonds!', "leader")

			awardTrophies('aDJHkmcQKwgnpbnEk', fixed[1]._id)
			Meteor.call('awardDiamondsCustom', fixed[1]._id, 40, '<img style="max-width:100%;" src="/2nd.png"> <br>Congrats On Winning Second Place Here is 20 Diamonds!', "leader")

			awardTrophies('YxG4SKtrfT9j8Abdk', fixed[2]._id)
			Meteor.call('awardDiamondsCustom', fixed[2]._id, 30, '<img style="max-width:100%;" src="/3rd.png"> <br>Congrats On Winning Third Place Here is 30 Diamonds!', "leader")

			Meteor.call('awardDiamonds', fixed[3]._id, 25)
			Meteor.call('awardDiamonds', fixed[4]._id, 22)
			Meteor.call('awardDiamonds', fixed[5]._id, 20)
			Meteor.call('awardDiamonds', fixed[6]._id, 17)
			Meteor.call('awardDiamonds', fixed[7]._id, 15)
			Meteor.call('awardDiamonds', fixed[8]._id, 12)
			Meteor.call('awardDiamonds', fixed[9]._id, 10)
		}
	},

	sendEmail: function(to, from, subject, text) {
		check([to, from, subject, text], [String]);

		// Let other method calls from the same client start running,
		// without waiting for the email sending to complete.
		this.unblock();

		Email.send({
			to: to,
			from: from,
			subject: subject,
			text: text
		});
	},

	'questionPush': function(game, message) {
		var game = Games.findOne({_id: game})
		var users = game.nonActive
		message = "Guess What Happens on " + message
		Push.send({
			from: 'Pickk',
			title: 'Update',
			text: message,
			sound: 'default',
			badge: 1,
			query: {userId: {$in: users}}
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
		Push.send({
			from: 'Pickk',
			title: 'Update',
			text: message,
			badge: 1,
			query: {}
		});
	},

	'pushInvite': function(message, userId) {
		Push.send({from: 'Pickk', title: 'Invite', text: message, badge: 1, query: {id: userId}});
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

	'updateProfile': function(userId, username, firstName, lastName) {
		UserList.update(userId,
			{
				$set: {
					'profile.username': username,
					'profile.firstName': firstName,
					'profile.lastName': lastName
				}
			});
    var user = UserList.findOne(userId);
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
			});
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

	'awardDiamonds': function(user, number) {
		var timeCreated = new Date();
		var id = Random.id();
		var number = parseInt(number)
		var message = "You Earned " + number + " Diamonds!"

		Meteor.users.update({_id: user}, {$inc: {"profile.diamonds": +number}});

		Meteor.users.update({_id: user},
			{
				$push: {
					pendingNotifications: {
						_id: id,
						type: "diamonds",
						read: false,
						notificationId: id,
						dateCreated: timeCreated,
						message: message
					}
				}
			}
		)
	},

	'awardDiamondsCustom': function(user, number, message, tag) {
		var timeCreated = new Date();
		var id = Random.id();
		var number = parseInt(number)
		var message = message

		Meteor.users.update({_id: user}, {$inc: {"profile.diamonds": +number}});

		Meteor.users.update({_id: user},
			{
				$push: {
					pendingNotifications: {
						_id: id,
						type: "diamonds",
						tag: tag,
						read: false,
						notificationId: id,
						dateCreated: timeCreated,
						message: message
					}
				}
			}
		)
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
		QuestionList.insert({
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

	'createTrueFalse': function(que, game) {
		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		QuestionList.insert({
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

		QuestionList.insert({
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

	'createPendingNotification': function(id, type, message) {
		var timeCreated = new Date();
		var id = Random.id();
		UserList.update({_id: accountToFollow},
			{
				$push: {
					pendingNotifications: {
						_id: id,
						dateCreated: timeCreated,
						type: type,
						message: message,
					}
				}
			});
	},

	// Users can create a group

	'createGroup': function(groupId, groupName, secretStatus) {
		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		Groups.insert({
			groupId: groupId,
			name: groupName,
			commissioner: currentUserId,
			dateCreated: timeCreated,
			members: [currentUserId],
			secret: secretStatus,
			avatar: "/twitter_logo.png"
		});

		var groupData = Groups.findOne({'name': groupName});

		Meteor.users.update({_id: currentUserId}, {
			$push: {"profile.groups": groupData._id}
		})

	},

	// Users can create a group

	'editGroup': function(id, groupId, groupName, secretStatus, description) {
		Groups.update({_id: id},
			{
				$set: {
					groupId: groupId,
					name: groupName,
					secret: secretStatus,
					desc: description
				}
			});
	},

	'requestInvite': function(userId, groupId) {
		Groups.update({_id: groupId},
			{$push: {requests: userId}}
		)
	},

	'removeRequest': function(userId, groupId) {
		Groups.update({_id: groupId},
			{$pull: {requests: userId}}
		)
	},

	// Users can add other users to join their group.

	'inviteToGroup': function(userId, ref, noteId) {
		var timeCreated = new Date();
		var id = Random.id();
		Groups.update({_id: noteId}, {$push: {invites: userId}})
		UserList.update({_id: userId},
			{
				$push: {
					pendingNotifications: {
						_id: id,
						dateCreated: timeCreated,
						referrer: ref,
						type: "group",
						notificationId: noteId
					}
				}
			});
	},

	'acceptRequest': function(groupId, id) {
		Meteor.call('removeRequest', id, groupId)
		Meteor.call('joinGroup', id, groupId)
		// var group = Groups.findOne({_id: groupId});

		// var message = "You have been added to " + group.groupId
		// Meteor.call('createPendingNotification', );
	},

	'denyRequest': function(groupId, id) {
		Meteor.call('removeRequest', id, groupId)
	},

	'deleteGroup': function(groupId) {
		var group = Groups.findOne({_id: groupId})
		var members = group.members

		//Remove each user from the list
		for (var i = members.length - 1; i >= 0; i--) {
			var member = members[i]

			//Remove From both list and their account
			Meteor.call('removeGroupMember', member, groupId);
		}
		;
		Groups.remove({_id: groupId});
	},


	'removeGroupMember': function(user, groupId) {
		// Remove user from the group's list
		Groups.update({_id: groupId}, {$pull: {members: user}});

		// Remove group from user's list
		UserList.update({_id: user}, {$pull: {'profile.groups': groupId}});
	},

	// Users can join any group

	'joinGroup': function(user, groupId) {
		Groups.update({_id: groupId}, {$push: {members: user}});
		UserList.update({_id: user}, {$push: {'profile.groups': groupId}});
	},

	// Users can leave groups they are apart of

	'leaveGroup': function(user, groupId) {
		Groups.update({_id: groupId}, {$pull: {members: user}});
		UserList.update({_id: user}, {$pull: {'profile.groups': groupId}});
	},

	// Option to follow user

	'followUser': function(user, accountToFollow) {
		var timeCreated = new Date();
		var id = Random.id();

		UserList.update({_id: user}, {$push: {'profile.following': accountToFollow}});

		UserList.update({_id: accountToFollow}, {$push: {'profile.followers': user}});

		UserList.update({_id: accountToFollow},
			{
				$push: {
					pendingNotifications: {
						_id: id,
						dateCreated: timeCreated,
						referrer: user,
						type: "follower",
					}
				}
			});

	},

	'loadLeaderboard': function() {
		var liveGame = Games.findOne({live: true});
		var selector = {_id: {$in: liveGame.users}}
		return UserList.find(
			selector,
			{
				fields: {
					'profile.username': 1,
					'profile.coins': 1,
					'profile.avatar': 1,
					'services.twitter.screenName': 1,
					'_id': 1
				}
			}).fetch();

	},

	'loadWeekLeaderboard': function() {
		return UserList.find(
			{"profile.diamonds": {$gt: 0}},
			{
				fields: {
					'profile.username': 1,
					'profile.diamonds': 1,
					'profile.avatar': 1,
					'services.twitter.screenName': 1,
					'_id': 1
				}
			}).fetch();

	},

	// Unfollow users they follow

	'unfollowUser': function(user, accountToFollow) {
		UserList.update({_id: user}, {$pull: {'profile.following': accountToFollow}});
		UserList.update({_id: accountToFollow}, {$pull: {'profile.followers': user}});
	},

	//Once the play starts change active status

	'deactivateStatus': function(questionId) {
		QuestionList.update(questionId, {$set: {'active': null}});
	},

	'reactivateStatus': function(questionId) {
		QuestionList.update(questionId, {$set: {'active': true}});
	},

	'deactivateGame': function(questionId) {
		QuestionList.update(questionId, {$set: {'active': "pending"}});
	},

	'activateGame': function(questionId) {
		QuestionList.update(questionId, {$set: {'active': true}});
	},

	// If the play is stopped before it starts or needs to be deleted for whatever reason.

	'removeQuestion': function(questionId) {
		QuestionList.update(questionId, {$set: {active: false, play: "deleted"}});

		var question = QuestionList.findOne({"_id": questionId});
		var option1 = question.options.option1.usersPicked
		var option2 = question.options.option2.usersPicked
		var option3 = question.options.option3.usersPicked
		var option4 = question.options.option4.usersPicked

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
		option3.map(function(user) {
			awardPointsBack(user)
		});
		option4.map(function(user) {
			awardPointsBack(user)
		});

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
		QuestionList.update(questionId, {$set: {active: false, play: answer}});

		var question = QuestionList.findOne({"_id": questionId});
		var option1 = question.options.option1.usersPicked
		var option2 = question.options.option2.usersPicked
		var option3 = question.options.option3.usersPicked
		var option4 = question.options.option4.usersPicked

		// If "op5" exists add the option to the end of the options object.
		if (question.options.option5) {
			var option5 = question.options.option5.usersPicked
		}

		if (question.options.option6) {
			var option6 = question.options.option6.usersPicked
		}

		var list = []

		function awardPoints(user, multiplier) {
			// Adjust multiplier based on when selected.
			var amount = parseInt(user.amount * multiplier)
			var timeCreated = new Date();
			var id = Random.id();
			var scoreMessage = "Nice Pickk! You got " + amount + " Coins!"

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
				var multiplier = parseFloat(question.options.option1.multiplier);
				awardPoints(user, multiplier)
			});
		} else if (answer == "option2") {
			option2.map(function(user) {
				var multiplier = parseFloat(question.options.option2.multiplier);
				awardPoints(user, multiplier)
			});
		} else if (answer == "option3") {
			option3.map(function(user) {
				var multiplier = parseFloat(question.options.option3.multiplier);
				awardPoints(user, multiplier);
			});
		} else if (answer == "option4") {
			option4.map(function(user) {
				var multiplier = parseFloat(question.options.option4.multiplier);
				awardPoints(user, multiplier);
			});
		} else if (answer == "option5") {
			option5.map(function(user) {
				var multiplier = parseFloat(question.options.option5.multiplier);
				awardPoints(user, multiplier);
			});
		} else if (answer == "option6") {
			option6.map(function(user) {
				var multiplier = parseFloat(question.options.option6.multiplier);
				awardPoints(user, multiplier);
			});
		}
	},

	'modifyTwoOptionQuestionStatus': function(questionId, answer) {
		QuestionList.update(questionId, {$set: {active: false, play: answer}});

		var question = QuestionList.findOne({"_id": questionId});
		var option1 = question.options.option1.usersPicked
		var option2 = question.options.option2.usersPicked

		var list = []

		function awardPoints(user, multiplier) {
			// Adjust multiplier based on when selected.
			var amount = parseInt(user.amount * multiplier)
			var timeCreated = new Date();
			var id = Random.id();
			var scoreMessage = "Nice Pickk! You got " + amount + " Coins!"

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
				var multiplier = parseFloat(question.options.option1.multiplier);
				awardPoints(user, multiplier)
			});
		} else if (answer == "option2") {
			option2.map(function(user) {
				var multiplier = parseFloat(question.options.option2.multiplier);
				awardPoints(user, multiplier)
			});
		}
	},

	'modifyBinaryQuestionStatus': function(questionId, answer) {
		QuestionList.update(questionId, {$set: {active: false, play: answer}});

		var question = QuestionList.findOne({"_id": questionId});
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
		QuestionList.update(questionId, {$set: {active: false, play: answer}});

		var question = QuestionList.findOne({"_id": questionId});
		var option1 = question.options.option1.usersPicked
		var option2 = question.options.option2.usersPicked
		var option3 = question.options.option3.usersPicked
		var option4 = question.options.option4.usersPicked
		var option5 = question.options.option5.usersPicked

		var list = []

		var game = QuestionList.findOne({_id: questionId})

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
		}
	},

// Remove Coins from the people who answered it "correctly", the answer changed. 

	'unAwardPoints': function(questionId, oldAnswer) {
		var question = QuestionList.findOne({"_id": questionId});
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
		QuestionList.update(questionId, {$set: {active: false, play: "deleted"}});

		var question = QuestionList.findOne({"_id": questionId});
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
		var question = QuestionList.findOne({"_id": questionId});
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
		var question = QuestionList.find({_id: questionId},
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
		QuestionList.update(questionId, {$push: {usersAnswered: user}});

		// Add user to the users who have played in the game.
		var gameInfo = QuestionList.findOne({_id: questionId})
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

		// var question = QuestionList.findOne({"_id": questionId});
		// var option1 = question.options.option1.usersPicked
		// var option2 = question.options.option2.usersPicked
		// var option3 = question.options.option3.usersPicked
		// var option4 = question.options.option4.usersPicked
		// var option5 = question.options.option5.usersPicked
		// var option6 = question.options.option6.usersPicked

		//Update the question with the users answer and wager.
		if (answer == "option1") {
			QuestionList.update(questionId, {$push: {'options.option1.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option2") {
			QuestionList.update(questionId, {$push: {'options.option2.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option3") {
			QuestionList.update(questionId, {$push: {'options.option3.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option4") {
			QuestionList.update(questionId, {$push: {'options.option4.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option5") {
			QuestionList.update(questionId, {$push: {'options.option5.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option6") {
			QuestionList.update(questionId, {$push: {'options.option6.usersPicked': {userID: user, amount: wager}}});
		}
	},

	'twoOptionQuestionAnswered': function(user, questionId, answer, wager, que) {
		// Grab the entire userAnswered array
		var question = QuestionList.find({_id: questionId},
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
		QuestionList.update(questionId, {$push: {usersAnswered: user}});

		// Add user to the users who have played in the game.
		var gameInfo = QuestionList.findOne({_id: questionId})
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

		var question = QuestionList.findOne({"_id": questionId});
		var option1 = question.options.option1.usersPicked
		var option2 = question.options.option2.usersPicked

		//Update the question with the users answer and wager.
		if (answer == "option1") {
			QuestionList.update(questionId, {$push: {'options.option1.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option2") {
			QuestionList.update(questionId, {$push: {'options.option2.usersPicked': {userID: user, amount: wager}}});
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
		QuestionList.update(questionId, {$push: {usersAnswered: user}});

		// Add user to the users who have played in the game.
		var gameInfo = QuestionList.findOne({_id: questionId})
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
			QuestionList.update(questionId, {$push: {'options.option1.usersPicked': {userID: user}}});
		} else if (answer == "option2") {
			QuestionList.update(questionId, {$push: {'options.option2.usersPicked': {userID: user}}});
		}
	},

	'gameQuestionAnswered': function(user, questionId, answer) {

		// Grab the entire userAnswered array
		var question = QuestionList.find({_id: questionId},
			{fields: {'usersAnswered': 1}}).fetch();

		// Check if userId is in the usersAnswered array
		var userExists = _.indexOf(question, user)

		// If the user is already in the array exit this process
		if (userExists !== -1) {
			return
		} else {

			// Update question with the user who have answered.
			QuestionList.update(questionId, {$push: {usersAnswered: user}});

			//Give user a diamond for answering
			Meteor.call('awardDiamonds', user, 5)

			//Add question and answer to the user's account.
			Meteor.users.update({_id: user}, {$push: {questionAnswered: {questionId: questionId, answered: answer}}});

			//Update the question with the users answer.
			if (answer == "option1") {
				QuestionList.update(questionId, {$push: {'options.option1.usersPicked': {userID: user}}});
			} else if (answer == "option2") {
				QuestionList.update(questionId, {$push: {'options.option2.usersPicked': {userID: user}}});
			} else if (answer == "option3") {
				QuestionList.update(questionId, {$push: {'options.option3.usersPicked': {userID: user}}});
			} else if (answer == "option4") {
				QuestionList.update(questionId, {$push: {'options.option4.usersPicked': {userID: user}}});
			} else if (answer == "option5") {
				QuestionList.update(questionId, {$push: {'options.option5.usersPicked': {userID: user}}});
			}
		}
	},

	'questionUnanswered': function(user, questionId, answer, wager) {
		// Remove user from the answer list
		QuestionList.update({_id: questionId}, {$pull: {usersAnswered: user}})

		//Remove question, wager and answer to the user's account.
		Meteor.users.update({_id: user}, {$pull: {questionAnswered: {questionId: questionId}}});

		//Update the question with the users answer and wager.
		if (answer == "option1") {
			QuestionList.update(questionId, {$pull: {'options.option1.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option2") {
			QuestionList.update(questionId, {$pull: {'options.option2.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option3") {
			QuestionList.update(questionId, {$pull: {'options.option3.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option4") {
			QuestionList.update(questionId, {$pull: {'options.option4.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option5") {
			QuestionList.update(questionId, {$pull: {'options.option5.usersPicked': {userID: user, amount: wager}}});
		} else if (answer == "option6") {
			QuestionList.update(questionId, {$pull: {'options.option6.usersPicked': {userID: user, amount: wager}}});
		}

		//Once a users has removed question add wager to their coins.
		Meteor.users.update({_id: user}, {$inc: {"profile.coins": +wager}});
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
