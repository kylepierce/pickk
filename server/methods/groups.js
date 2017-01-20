Meteor.methods({
	'isGroupNameUnique': function(name) {
		check(name, String);
		name = name.trim()
		if (!name) {
			return true;
		}
		var groupExists = Groups.find({name: name}).count()
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
		);

		var group = Groups.find({_id: groupId}).fetch();

		var notifyObj = {
	  	type: "group",
			status: "Requested invite from you to",
	  	senderId: userId,
	  	userId: group[0].commissioner,
	  	groupId: groupId
	  }

	  createPendingNotification(notifyObj)
	},

	'removeRequest': function(userId, groupId) {
		check(userId, String);
		check(groupId, String);
		Groups.update({_id: groupId},
			{$pull: {requests: userId}}
		)
	},

	// Users can add other users to join their group.
	'inviteToGroup': function(invitee, inviter, groupId) {
		check(invitee, String);
		check(inviter, String);
		check(groupId, String);
		Groups.update({_id: groupId}, {$push: {invites: invitee}}, { validate: false })

	  var notifyObj = {
	  	type: "group",
	  	senderId: inviter,
	  	userId: invitee,
	  	groupId: groupId
	  }
	  createPendingNotification(notifyObj)
	},

	'acceptRequest': function(groupId, userId, inviter) {
		check(userId, String);
		check(groupId, String);
		check(inviter, String);
		Meteor.call('removeRequest', userId, groupId)
		Meteor.call('joinGroup', userId, groupId)

		var notifyObj = {
	  	type: "group",
			status: "Accepted Your Request to ",
	  	senderId: inviter,
	  	userId: userId,
	  	groupId: groupId
	  }
	  createPendingNotification(notifyObj)
	},

	'denyRequest': function(groupId, userId, inviter) {
		check(userId, String);
		check(groupId, String);
		check(inviter, String);
		Meteor.call('removeRequest', id, groupId);
		var notifyObj = {
	  	type: "group",
			status: "Denied Your Request to ",
	  	senderId: inviter,
	  	userId: userId,
	  	groupId: groupId
	  }
	  createPendingNotification(notifyObj)
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

	'removeGroupMember': function(userId, groupId, inviter) {
		check(userId, String);
		check(groupId, String);
		check(inviter, String);
		// Remove user from the group's list
		Groups.update({_id: groupId}, {$pull: {members: userId}});

		// Remove group from user's list
		UserList.update({_id: userId}, {$pull: {'profile.groups': groupId}});
		var notifyObj = {
			type: "group",
			status: "removed",
			senderId: inviter,
			userId: userId,
			groupId: groupId
		}
		createPendingNotification(notifyObj)
	},

	// Users can join any group
	'joinGroup': function(user, groupId) {
		check(user, String);
		check(groupId, String);
		Groups.update({_id: groupId}, {$push: {members: user}}, { validate: false });
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
