Meteor.methods({
	'isUsernameUnique': function(username) {
		check(username, String);

		username = username.trim()
		if (!username) {
			return true;
		}
		return !UserList.find({_id: {$ne: this.userId}, "profile.username": new RegExp("^" + escapeRegExp(username) + "$", "i")}).count()
	},
})