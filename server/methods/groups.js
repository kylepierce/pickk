Meteor.methods({
	// 'isGroupNameUnique': function(name) {
	// 	check(name, String);
	// 	name = name.trim()
	// 	if (!name) {
	// 		return true;
	// 	}
	// 	var leagueExists = Groups.find({name: name}).count()
	// 	if (leagueExists > 0){
	// 		console.log("Group Already Exists")
	// 		return true
	// 	} else {
	// 		return false
	// 	}
	// },

	// 'editGroup': function(id, leagueName, secretStatus, description) {
	// 	check(id, String);
	// 	check(leagueName, String);
	// 	check(secretStatus, String);
	// 	check(description, String);
	// 	Groups.update({_id: id},
	// 		{
	// 			$set: {
	// 				name: leagueName,
	// 				secret: secretStatus,
	// 				desc: description
	// 			}
	// 		});
	// },

	'setLeagueAvatar': function(id, avatar) {
		check(id, String);
		check(avatar, String);
		var league = Groups.findOne({_id: id});
		Groups.update({_id: id}, {$set: {avatar: avatar}});
	},

	'requestLeagueInvite': function(userId, leagueId) {
		check(userId, String);
		check(leagueId, String);
		Groups.update({_id: leagueId},
			{$push: {requests: userId}}
		);

		var league = Groups.findOne({_id: leagueId});

		var notifyObj = {
	  	type: "league",
			status: "Requested invite from you to",
	  	senderId: userId,
	  	userId: league.commissioner,
	  	leagueId: leagueId
	  }

	  createPendingNotification(notifyObj)
	},

	'removeLeagueRequest': function(userId, leagueId) {
		check(userId, String);
		check(leagueId, String);
		Groups.update({_id: leagueId}, {$pull: {requests: userId}})
	},

	// Users can add other users to join their league
	'inviteToLeague': function(invitee, inviter, leagueId) {
		check(invitee, String);
		check(inviter, String);
		check(leagueId, String);
		Groups.update({_id: leagueId}, {$push: {invites: invitee}}, { validate: false })

	  var notifyObj = {
	  	type: "league",
	  	senderId: inviter,
	  	userId: invitee,
	  	leagueId: leagueId
	  }
	  createPendingNotification(notifyObj)
	},

	'acceptLeagueRequest': function(leagueId, userId, inviter) {
		check(userId, String);
		check(leagueId, String);
		check(inviter, String);
		Meteor.call('removeLeagueRequest', userId, leagueId)
		Meteor.call('joinLeague', userId, leagueId)

		var notifyObj = {
	  	type: "league",
			status: "Accepted Your Request to ",
	  	senderId: inviter,
	  	userId: userId,
	  	leagueId: leagueId
	  }
	  createPendingNotification(notifyObj)
	},

	'denyLeagueRequest': function(leagueId, userId, inviter) {
		check(userId, String);
		check(leagueId, String);
		check(inviter, String);
		Meteor.call('removeLeagueRequest', id, leagueId);
		var notifyObj = {
	  	type: "league",
			status: "Denied Your Request to ",
	  	senderId: inviter,
	  	userId: userId,
	  	leagueId: leagueId
	  }
	  createPendingNotification(notifyObj)
	},

	'deleteLeague': function(leagueId) {
		check(leagueId, String);
		var league = Groups.findOne({_id:leagueId})
		var members = league.members

		//Remove each user from the list
		for (var i = members.length - 1; i >= 0; i--) {
			var member = members[i]

			//Remove From both list and their account
			Meteor.call('removeLeagueMember', member, leagueId, member);
		}
		;
		Groups.remove({_id: leagueId});
	},

	'removeLeagueMember': function(userId, leagueId, inviter) {
		check(userId, String);
		check(leagueId, String);
		check(inviter, String);
		// Remove user from the league's list
		Groups.update({_id: leagueId}, {$pull: {members: userId}});

		// Remove league from user's list
		var notifyObj = {
			type: "league",
			status: "removed",
			senderId: inviter,
			userId: userId,
			leagueId: leagueId
		}
		createPendingNotification(notifyObj)
	},

	// Users can join any league
	'joinLeague': function(user, leagueId) {
		check(user, String);
		check(leagueId, String);
		Groups.update({_id: leagueId}, {$push: {members: user}}, { validate: false });
	},

	// Users can leave leagues they are apart of
	'leaveLeague': function(user, leagueId) {
		check(user, String);
		check(leagueId, String);
		Groups.update({_id: leagueId}, {$pull: {members: user}});
		UserList.update({_id: user}, {$pull: {'profile.leagues': leagueId}});
	}
})
