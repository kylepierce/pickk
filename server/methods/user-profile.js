Meteor.methods({
	'totalDiamonds': function(userId){
		check(userId , String);
	  var selector = {
	    userId: userId
	  }
	  var diamonds = GamePlayed.aggregate(
	    { $match: selector },
	    { $group: {
	      _id: '$userId',
	      diamonds: { $sum: '$diamonds'}
	  	}}
		);
	  return diamonds[0].diamonds
	},
	'totalCoins': function(userId){
		check(userId , String);

	  var selector = {
	    userId: userId
	  }
	  var diamonds = GamePlayed.aggregate(
	    { $match: selector },
	    { $group: {
	      _id: '$userId',
	      coins: { $sum: '$coins'}
	    }});
	    return diamonds[0].coins
	},
	'totalQue': function(userId){
		check(userId , String);

	  var selector = {
	    userId: userId
	  }
	  var diamonds = GamePlayed.aggregate(
	    { $match: selector },
	    { $group: {
	      _id: '$userId',
	      queCounter: { $sum: '$queCounter'}
	    }});

	    return diamonds[0].queCounter
	},
	// Update users info from the settings page
	'updateProfile': function(username, email, firstName, lastName, birthday, timezone) {
		console.log(username, email, firstName, lastName, birthday, timezone);
		check(username, String);
		check(email, String);
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
					'emails.0.address': email,
					'profile.username': username,
					'profile.firstName': firstName,
					'profile.lastName': lastName,
					'profile.birthday': birthday,
					'profile.timezone': timezone
				}
			});
	},

	'onBoarded': function () {
		if (!this.userId) {
			return;
		}
		UserList.update(this.userId,
			{$set: {'profile.isOnboarded': true}}
		);
	},

	'ratingPrompt': function () {
		if (!this.userId) {
			return;
		}
		var now = new Date();
		UserList.update(this.userId,
			{$set: {'profile.lastAsked': now}}
		);
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
	},

	'updateFavorites': function (selectionArray, type) {
		check(selectionArray, Array);
		check(type, String);

		if (!this.userId) {
			return;
		}

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
			case 'favoriteNBATeams':
				UserList.update(this.userId,
					{
						$set: {'profile.favoriteNBATeams': selectionArray}
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
	'updateNotificationFilter': function(type){
		check(type, String)
		var userId = this.userId
		var user = UserList.find({_id: userId}).fetch()
		var existing = user[0].profile.notifications
		if (!existing){
			var existing = []
		}
		var spot = existing.indexOf(type)
		if (spot === -1){
			var mod = {$push: {'profile.notifications': type}}
		} else if (spot >= 0){
			var mod = {$pull: {'profile.notifications': type}}
		}
		UserList.update(this.userId, mod)
	},
	'updateGamesFilter': function(type){
		check(type, String)
		var userId = this.userId
		var user = UserList.find({_id: userId}).fetch()
		var existing = user[0].profile.gamesFilter
		if (!existing){
			var existing = []
		}
		var spot = existing.indexOf(type)
		if (spot === -1){
			var mod = {$push: {'profile.gamesFilter': type}}
		} else if (spot >= 0){
			var mod = {$pull: {'profile.gamesFilter': type}}
		}
		UserList.update(this.userId, mod)
	}
})
