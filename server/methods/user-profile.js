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
		check(teamsArr, Array);

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

	'updateFavorites': function (selectionArray, type) {
		check(selectionArray, Array);
		check(type, String);

		if (!this.userId) {
			return;
		}

		console.log("updating - ", type, selectionArray);

		switch(type) {
			case 'favoriteSports':
				UserList.update(this.userId,
					{
						$set: {'profile.favoriteSports': selectionArray}
					});
				break;
			case 'favoriteMLBTeams':
				UserList.update(this.userId,
					{
						$set: {'profile.favoriteMLBTeams': selectionArray}
					});
				break;
			case 'favoriteNFLTeams':
				UserList.update(this.userId,
					{
						$set: {'profile.favoriteNFLTeams': selectionArray}
					});
				break;	
		}
		
	},
})