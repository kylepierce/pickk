Meteor.methods({
  'createMatchup': function(o){
    check(o, Object);
    this.unblock();
    Matchup.insert(o);
  },
  'joinMatchup': function(matchupId, userId){
    check(matchupId, String);
    check(userId, String);
    this.unblock();
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
    this.unblock();
    var matchup = Matchup.findOne({_id: matchupId});
    var users = matchup.users
    Matchup.update({_id: matchupId}, {$pull: {users: userId}}, { validate: false });
  },
  'deleteMatchup': function(matchupId, deletor){
    check(matchupId, String);
		check(deletor, String);
		this.unblock();
		var matchup = Matchup.findOne({_id: matchupId});
		var deletorProfile = Meteor.users.findOne({_id: deletor});
		var isAdmin = deletorProfile.profile.role
    if (matchup.commissioner === deletor) {
      Matchup.remove({_id: matchupId});
    } else if (isAdmin === "admin"){
			Matchup.remove({_id: matchupId});
		} else {
			throw new Meteor.Error("not-authorized", "Cannot delete a matchup of another user");
		}
  },
  'requestMatchInvite': function(matchupId, userId){
    check(matchupId, String);
    check(userId, String);
    this.unblock();
    Matchup.update({_id: matchupId}, {$push: {requests: userId}});
  },
  'removeMatchInvite': function(matchupId, userId){
    check(matchupId, String);
    check(userId, String);
    this.unblock();
    Matchup.update({_id: matchupId}, {$pull: {requests: userId}});
  },
  // Users can add other users to join their group.
	'inviteToMatchup': function(invitee, inviter, matchupId) {
		check(invitee, String);
		check(inviter, String);
		check(matchupId, String);
    this.unblock();
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
    this.unblock();
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
