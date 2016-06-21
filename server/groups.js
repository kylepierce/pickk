Meteor.methods({
	// Users can create a group
	'createGroup': function(groupId, groupName, secretStatus) {
		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		Groups.insert({
			groupId: groupId,
			name: groupName,
			commissioner: currentUserId,
			dateCreated: timeCreated,
			members: [currentUserId],
			secret: secretStatus,
			avatar: "/twitter_logo.png"
		});

		var groupData = Groups.findOne({'name': groupName});

		Meteor.users.update({_id: currentUserId}, {
			$push: {"profile.groups": groupData._id}
		})

	},

	'editGroup': function(id, groupId, groupName, secretStatus, description) {
		Groups.update({_id: id},
			{
				$set: {
					groupId: groupId,
					name: groupName,
					secret: secretStatus,
					desc: description
				}
			});
	},

	'setGroupAvatar': function(id, avatar) {
		Groups.update({_id: id},
			{
				$set: {
					avatar: avatar
				}
			});
	},

	'requestInvite': function(userId, groupId) {
		Groups.update({_id: groupId},
			{$push: {requests: userId}}
		)
	},

	'removeRequest': function(userId, groupId) {
		Groups.update({_id: groupId},
			{$pull: {requests: userId}}
		)
	},

	// Users can add other users to join their group.

	'inviteToGroup': function(userId, ref, noteId) {
		var timeCreated = new Date();
		var id = Random.id();
		Groups.update({_id: noteId}, {$addToSet: {invites: userId}})
		UserList.update({_id: userId},
			{
				$push: {
					pendingNotifications: {
						_id: id,
						dateCreated: timeCreated,
						referrer: ref,
						type: "group",
						notificationId: noteId
					}
				}
			});
	},

	'acceptRequest': function(groupId, id) {
		Meteor.call('removeRequest', id, groupId)
		Meteor.call('joinGroup', id, groupId)
		// var group = Groups.findOne({_id: groupId});

		// var message = "You have been added to " + group.groupId
		// Meteor.call('createPendingNotification', );
	},

	'denyRequest': function(groupId, id) {
		Meteor.call('removeRequest', id, groupId)
	},

	'deleteGroup': function(groupId) {
		var group = Groups.findOne({_id: groupId})
		var members = group.members

		//Remove each user from the list
		for (var i = members.length - 1; i >= 0; i--) {
			var member = members[i]

			//Remove From both list and their account
			Meteor.call('removeGroupMember', member, groupId);
		}
		;
		Groups.remove({_id: groupId});
	},


	'removeGroupMember': function(user, groupId) {
		// Remove user from the group's list
		Groups.update({_id: groupId}, {$pull: {members: user}});

		// Remove group from user's list
		UserList.update({_id: user}, {$pull: {'profile.groups': groupId}});
	},

	// Users can join any group

	'joinGroup': function(user, groupId) {
		Groups.update({_id: groupId}, {$push: {members: user}});
		UserList.update({_id: user}, {$push: {'profile.groups': groupId}});
	},

	// Users can leave groups they are apart of

	'leaveGroup': function(user, groupId) {
		Groups.update({_id: groupId}, {$pull: {members: user}});
		UserList.update({_id: user}, {$pull: {'profile.groups': groupId}});
	},
})