Meteor.methods({
	'addChatMessage': function(o) {
		check(o, Object);
		this.unblock()
		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (o.user !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized", "Cannot post message an another user");
		}

		var timeCreated = new Date();
		var id = Random.id();
		var messageData = {
			_id: id,
			dateCreated: timeCreated,
			group: o.groupId,
			user: o.user,
			message: o.message
		}
		// if it is an award
		var sharableTypes = ["coins", "diamonds", "trophy"]
		var sharable = sharableTypes.indexOf(o.type)
		if ( sharable >= 0 ) {
			messageData['type'] = o.type
		} else if (o.type === "reaction"){
			messageData['type'] = "reaction"
			messageData['reaction'] = o.reaction
			switch (o.reaction) {
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
		} else {
			var messagePosted = o.message.replace(/<\/?[^>]+(>|$)/g, "").trim();
			if (messagePosted == "" || messagePosted == null) {
				messageData['message'] = "<i>Removed</i>"
			}

			else {
				messageData['message'] = messagePosted
				var usernames = messagePosted.match(/\@[\w\d_]+/g);

				if (usernames) {
					for (var i = 0; i < usernames.length; i++) {
						var username = usernames[i].slice(1); // remove @
						var user = Meteor.users.findOne({"profile.username": username}, {fields: {_id: 1}});

						if (user) {
							// Push notifications don't support HTML, so we'll have to use plainMessagePosted
							var notifyObj = {
								userId: user._id,
								messageId: messageData._id,
								type: "mention",
								senderId: o.user,
								message: o.message,
								groupId: o.groupId
							}
							var sender = Meteor.users.findOne({_id: o.user})
							var senderUsername = sender.profile.username
							var pushMessage = "[@" + senderUsername + "] " + o.message

							console.log(pushMessage)

							Meteor.call('pushInvite', pushMessage, user._id)
		 					createPendingNotification(notifyObj)
						}
					}
				}
			}
		}
		Chat.insert(messageData)
	},

	'addReactionToMessage': function(author, messagePosted, messageId) {
		check(author, String);
		check(messagePosted, String);
		check(messageId, String);
		this.unblock()

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (author !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized", "Cannot post message an another user");
		}

		var timeCreated = new Date();
		var reaction = messagePosted

		var chat = Chat.findOne({_id: messageId});

		var checkUser;
		var lastCheckedKey = null;
		var lastCheckedIndex = null;

		// Check if the user already has a previous reaction stored in this chat message
		if (chat && chat.reactions) {

			// This "find" loop will return a valid 'reactedObj' ONLY if a previous rection was found.. Then lastCheckedKey and lastCheckedIndex will contain the values where the last reaction is stored exactly
			var reactedObj = _.find(chat.reactions, function (reactionArr, key) {
					lastCheckedKey = key;
					checkUser = _.find(reactionArr, function (obj, index) {
						lastCheckedIndex = index
						return obj.user === author;
					});
					return checkUser;
				});

			if (reactedObj) {
				// FOUND! - User already has a reaction - Remove it from the array and update the Chat
				chat.reactions[lastCheckedKey].splice(lastCheckedIndex, 1);
			}
		}

		// If selected 'None', update colleciton and return
		if (reaction === 'none') {
			Chat.update({_id: messageId}, {$set: {'reactions': chat.reactions}});
			return true;
		}

		// Object to be inserted
		var reactionObj = {
			user: author,
			timestamp: timeCreated
		};

		// If the message has no reactions, create an empty reactions object
		if (!chat.reactions) {
			chat['reactions'] = {};
		}

		// If there already is an array of the reaction to be inserted, just push the new object
		if (chat.reactions[reaction] && chat.reactions[reaction].constructor === Array) {
			chat.reactions[reaction].push(reactionObj);
		} else {
			// else, Create a new array and add the object
			chat.reactions[reaction] = [reactionObj];
		}

		// Update the collection with the changes in reactions object
		Chat.update({_id: messageId}, {$set: {'reactions': chat.reactions}});

		var notifyObj = {
			userId: chat.user,
			messageId: messageId,
			type: "chatReaction",
			senderId: author,
			reaction: reaction,
			message: chat.message
		}
		createPendingNotification(notifyObj);
	},

	'deleteMessage': function(messageId, deletor){
		check(messageId, String);
		check(deletor, String);
		this.unblock()
		var message = Chat.findOne({_id: messageId})
		var userId = message.user
		var deletorProfile = Meteor.users.findOne({_id: deletor})
		var isAdmin = deletorProfile.profile.role
		if (userId === deletor) {
			console.log("Message owner. This user has permission to delete.")
			Chat.update({_id: messageId}, {$set: {group: "Deleted"}});
		} else if (isAdmin === "admin"){
			console.log("This user has permission to delete.")
			Chat.update({_id: messageId}, {$set: {group: "Deleted"}});
		} else {
			throw new Meteor.Error("not-authorized", "Cannot delete a message of another user");
		}
	}
});
