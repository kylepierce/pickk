Meteor.methods({
	'addChatMessage': function(author, messagePosted, groupId) {
		check(author, String);
		check(messagePosted, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (author !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized", "Cannot post message an another user");
		}

		var timeCreated = new Date();
		var id = Random.id();
		var messagePosted = messagePosted.replace(/<\/?[^>]+(>|$)/g, "").trim();
		var plainMessagePosted = messagePosted;
		var code = messagePosted.slice(0,6)
		if (code == "+!Meow") {
				var message = messagePosted.slice(7, -1)
				var messagePosted = "<b>" + message + "</b>"
		} else if (messagePosted[0] == "[") {
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

		var messageId = Chat.insert({
			_id: id,
			dateCreated: timeCreated,
			group: groupId,
			user: author,
			message: messagePosted
		});

		var usernames = messagePosted.match(/\@[\w\d_]+/g);
		if (usernames) {
			for (var i = 0; i < usernames.length; i++) {
				var username = usernames[i].slice(1); // remove @
				var user = Meteor.users.findOne({"profile.username": username}, {fields: {_id: 1}});
				if (user) {
					// Push notifications don't support HTML, so we'll have to use plainMessagePosted
					Meteor.call('pushInvite', plainMessagePosted, user._id)
					createPendingNotification(user._id, messageId + "_" + user._id, "mention", plainMessagePosted)
				}
			}
		}

	},
	'addReactionToMessage': function(author, messagePosted, messageId) {
		check(author, String);
		check(messagePosted, String);
		check(messageId, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (author !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized", "Cannot post message an another user");
		}

		var timeCreated = new Date();
		var reaction = messagePosted.slice(1, -1);

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
				Chat.update({_id: messageId}, {$set: {'reactions': chat.reactions}});
			}
		}

		var reactionObj = {
			user: author,
			timestamp: timeCreated
		};

		console.log("****** Adding reaction --- " + reaction );

		// cannot use variable inside DB update statement. Will need switch statement
		switch (messagePosted) {
			case "[dead]":
					Chat.update({_id: messageId}, {$push: {'reactions.dead': reactionObj }});
				break;
			case "[omg]":
					Chat.update({_id: messageId}, {$push: {'reactions.omg': reactionObj }});
				break;
			case "[fire]":
					Chat.update({_id: messageId}, {$push: {'reactions.fire': reactionObj }});
				break;
			case "[dying]":
					Chat.update({_id: messageId}, {$push: {'reactions.dying': reactionObj }});
				break;
			case "[hell-yeah]":
					Chat.update({_id: messageId}, {$push: {'reactions.hell-yeah': reactionObj }});
				break;
			case "[what]":
					Chat.update({_id: messageId}, {$push: {'reactions.what': reactionObj }});
				break;
			case "[pirate]":
					Chat.update({_id: messageId}, {$push: {'reactions.pirate': reactionObj }});
				break;
			case "[love]":
					Chat.update({_id: messageId}, {$push: {'reactions.love': reactionObj }});
				break;
			case "[tounge]":
					Chat.update({_id: messageId}, {$push: {'reactions.tounge': reactionObj }});
				break;
			case "[oh-no]":
					Chat.update({_id: messageId}, {$push: {'reactions.oh-no': reactionObj }});
				break;
			case "[what-the-hell]":
					Chat.update({_id: messageId}, {$push: {'reactions.what-the-hell': reactionObj }});
				break;
		}
	}
});
