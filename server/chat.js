Meteor.methods({
	'addChatMessage': function(author, messagePosted, groupId) {
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

	}
});
