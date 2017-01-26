Meteor.methods({
	'isUsernameUnique': function(username) {
		check(username, String);

		username = username.trim()
		if (!username) {
			return true;
		}
		return !UserList.find({_id: {$ne: this.userId}, "profile.username": new RegExp("^" + escapeRegExp(username) + "$", "i")}).count()
	},
	'isEmailUnique': function(email) {
		check(email, String);

		email = email.trim()
		if (!email) {
			return true;
		}
		return !UserList.find({_id: {$ne: this.userId}, "emails.0.address": new RegExp("^" + escapeRegExp(email) + "$", "i")}).count()
	},
})
