Meteor.methods({
		// Option to follow user

	'followUser': function(user, accountToFollow) {
		check(user, String);
		check(accountToFollow, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (user !== Meteor.userId()) {
			throw new Meteor.Error(403, "Unauthorized");
		}

		var timeCreated = new Date();
		var id = Random.id();

		UserList.update({_id: user}, {$push: {'profile.following': accountToFollow}});

		UserList.update({_id: accountToFollow}, {$push: {'profile.followers': user}});

		UserList.update({_id: accountToFollow},	{$push: {
			pendingNotifications: {
				_id: id,
				dateCreated: timeCreated,
				referrer: user,
				type: "follower",
			}
		}});
	},
	// Unfollow users they follow

	'unfollowUser': function(user, accountToFollow) {
		check(user, String);
		check(accountToFollow, String);

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (user !== Meteor.userId()) {
			throw new Meteor.Error(403, "Unauthorized");
		}
		
		UserList.update({_id: user}, {$pull: {'profile.following': accountToFollow}});
		UserList.update({_id: accountToFollow}, {$pull: {'profile.followers': user}});
	},
})