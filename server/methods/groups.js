Meteor.methods({
	// Users can create a group
	'createGroup': function(groupName, secretStatus) {
		check(groupName, String);
		check(secretStatus, String);
		var exists = Meteor.call('isGroupNameUnique', groupName)
		if (exists) {
			return false
		}
		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		Groups.insert({
			name: groupName,
			commissioner: currentUserId,
			dateCreated: timeCreated,
			members: [currentUserId],
			secret: secretStatus,
			avatar: "/twitter_logo.png",
			invites: []
		});

		var groupData = Groups.findOne({'name': groupName});

		Meteor.users.update({_id: currentUserId}, {
			$push: {"profile.groups": groupData._id}
		})

	},

	'isGroupNameUnique': function(name) {
		check(name, String);
		name = name.trim()
		if (!name) {
			return true;
		}
		var groupExists = Groups.find({name: name}).count()
		console.log("group exists", groupExists)
		if (groupExists > 0){
			console.log("Group Already Exists")
			return true
		} else {
			return false
		}
	},
	
	'editGroup': function(id, groupName, secretStatus, description) {
		check(id, String);
		check(groupName, String);
		check(secretStatus, String);
		check(description, String);
		Groups.update({_id: id},
			{
				$set: {
					name: groupName,
					secret: secretStatus,
					desc: description
				}
			});
	},

	'setGroupAvatar': function(id, avatar) {
		check(id, String);
		check(avatar, String);
		Groups.update({_id: id},
			{
				$set: {
					avatar: avatar
				}
			});
	},

	'requestInvite': function(userId, groupId) {
		check(userId, String);
		check(groupId, String);
		Groups.update({_id: groupId},
			{$push: {requests: userId}}
		)
	},

	'removeRequest': function(userId, groupId) {
		check(userId, String);
		check(groupId, String);
		Groups.update({_id: groupId},
			{$pull: {requests: userId}}
		)
	},

	// Users can add other users to join their group.
	'inviteToGroup': function(userId, sender, groupId) {
		check(userId, String);
		check(sender, String);
		check(groupId, String);
		Groups.update({_id: groupId}, {$addToSet: {invites: userId}})

	  var notifyObj = {
	  	type: "group",
	  	senderId: sender,
	  	userId: userId,
	  	groupId: groupId
	  }
	  createPendingNotification(notifyObj)
	},

	'acceptRequest': function(groupId, id) {
		check(id, String);
		check(groupId, String);
		Meteor.call('removeRequest', id, groupId)
		Meteor.call('joinGroup', id, groupId)
	},

	'denyRequest': function(groupId, id) {
		check(id, String);
		check(groupId, String);
		Meteor.call('removeRequest', id, groupId)
	},

	'deleteGroup': function(groupId) {
		check(groupId, String);
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
		check(user, String);
		check(groupId, String);
		// Remove user from the group's list
		Groups.update({_id: groupId}, {$pull: {members: user}});

		// Remove group from user's list
		UserList.update({_id: user}, {$pull: {'profile.groups': groupId}});
	},

	// Users can join any group
	'joinGroup': function(user, groupId) {
		check(user, String);
		check(groupId, String);
		Groups.update({_id: groupId}, {$push: {members: user}});
		UserList.update({_id: user}, {$push: {'profile.groups': groupId}});
	},

	// Users can leave groups they are apart of
	'leaveGroup': function(user, groupId) {
		check(user, String);
		check(groupId, String);
		Groups.update({_id: groupId}, {$pull: {members: user}});
		UserList.update({_id: user}, {$pull: {'profile.groups': groupId}});
	}
})
