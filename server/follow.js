Meteor.methods({
		// Option to follow user

	'followUser': function(user, accountToFollow) {
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
		UserList.update({_id: user}, {$pull: {'profile.following': accountToFollow}});
		UserList.update({_id: accountToFollow}, {$pull: {'profile.followers': user}});
	},
})