Meteor.methods({
  'createMatchup': function(o){
    check(o, Object);
    Matchup.insert(o);
  },
  'joinMatchup': function(matchupId, userId){
    check(matchupId, String);
    check(userId, String);
    var matchup = Matchup.find({_id: matchupId}).fetch()
    var users = matchup[0].users
    var alreadyUser = users.indexOf(userId)

    if(alreadyUser < 0){
      Matchup.update({_id: matchupId}, {$push: {users: userId}});
    }
  },
  'leaveMatchup': function(matchupId, userId){
    check(matchupId, String);
    check(userId, String);
    var matchup = Matchup.find({_id: matchupId}).fetch()
    var users = matchup[0].users
    Matchup.update({_id: matchupId}, {$pull: {users: userId}});
  },
  'requestMatchInvite': function(matchupId, userId){
    check(matchupId, String);
    check(userId, String);
    Matchup.update({_id: matchupId}, {$push: {requests: userId}});
  },
  'removeMatchInvite': function(matchupId, userId){
    check(matchupId, String);
    check(userId, String);
    Matchup.update({_id: matchupId}, {$pull: {requests: userId}});
  },
  // Users can add other users to join their group.
	'inviteToMatchup': function(invitee, inviter, matchupId) {
		check(invitee, String);
		check(inviter, String);
		check(matchupId, String);
		Matchup.update({_id: matchupId}, {$push: {invites: invitee}}, { validate: false })

	  var notifyObj = {
	  	type: "matchup",
	  	senderId: inviter,
	  	userId: invitee,
	  	matchupId: matchupId
	  }
	  createPendingNotification(notifyObj)
	},
  'removeMatchupMember': function(userId, matchupId, inviter) {
    check(userId, String);
    check(matchupId, String);
    check(inviter, String);
    // Remove user from the group's list
    Matchup.update({_id: matchupId}, {$pull: {users: userId}}, { validate: false });

    var notifyObj = {
      type: "matchup",
      status: "removed",
      senderId: inviter,
      userId: userId,
      matchupId: matchupId
    }
    createPendingNotification(notifyObj)
  },
});
