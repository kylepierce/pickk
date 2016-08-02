Meteor.methods({

	// Update users info from the settings page

	'updateProfile': function(username, firstName, lastName, birthday, timezone) {
		check(username, String);									
		check(firstName, Match.Maybe(String));		// Match.Maybe -> used for optional fields.. updateProfile being called only with username in 'at_config,js' file
		check(lastName, Match.Maybe(String));
		check(birthday, Match.Maybe(Date));
		check(timezone, Match.Maybe(String));

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
		check(teamsArr, String);

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
})