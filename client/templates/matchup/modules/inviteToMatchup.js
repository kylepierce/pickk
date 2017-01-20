Template.inviteToMatchup.helpers({
  following: function () {
    var user = Meteor.user();
    return user.profile.following
  },
  players: function(userId) {
  	var user = UserList.findOne({_id: userId});
  	return user
  }
});
Template.inviteMatchupButton.helpers({
  isInvited: function() {
    var invitee = this.__originalId
    if (!invitee) {
      var invitee = this._id
    }
    var matchup = Matchup.findOne(Router.current().params._id);
    return ~matchup.invites.indexOf(invitee);
  }
});

Template.inviteMatchupButton.events({
	'click [data-action=invite]': function(e, t){
    var invitee = this.__originalId
    if (!invitee) {
      var invitee = this._id
      var username = UserList.find({_id: invitee}).fetch()[0].profile.username
    } else {
      var username = this.profile.username
    }
    var inviter = Meteor.userId()
    var matchupId = Router.current().params._id

    Meteor.call("inviteToMatchup", invitee, inviter, matchupId);

    var matchupData = Matchup.findOne(matchupId)
    // var matchupName = matchupData.name
    // var message = Meteor.user().profile.username + " has invited you to join " + matchupName

    // Meteor.call('pushInvite', message, this.__originalId);

    $("#" + invitee).addClass('button-balanced');
    $("#" + invitee).prop("disabled", true)
    $("#" + invitee).append(document.createTextNode("d"));
    // sAlert.success("Invited " + username + " to " + matchupName , {effect: 'slide', position: 'bottom', html: true});
	}
});

Template.inviteToMatchupBox.helpers({
  UserListIndex: function() {
    return UserListIndex;
  },
  followers: function(){
    var user = Meteor.user().profile.followers
    return user
  },
});

Template.inviteToMatchupBox.events({
  "click [data-action=textInvite]": function(e, t){
    if(Meteor.isCordova){
      var branchUniversalObj = null;
      var ref = Meteor.userId();
      var username = Meteor.user().profile.username
      var matchupId = Router.current().params._id
      // var matchup = Matchup.findOne(matchupId);

      var message = 'Predict the Next Play on Pickk! Click the Link to Join and Compete Live!'

      analytics.track("invited to matchup", {
        userId: ref,
        type: 'share-sheet',
        location: "matchup invite",
        matchup: matchupId,
        dateCreated: new Date()
      });

      var intercomData = {
        "last_shared_at": parseInt(Date.now() / 1000),
        "share_type": "text",
        "userId": ref,
      }
      updateIntercom(intercomData)

      Branch.createBranchUniversalObject({
        canonicalIdentifier: 'user-profile/'+ ref,
        title: 'Matchup Invite!',
        contentDescription: message,
        contentMetadata: {
          'userId': ref,
          'userName': username,
          'matchupId': matchupId
        }
      }).then(function (newBranchUniversalObj) {
        branchUniversalObj = newBranchUniversalObj;
        branchUniversalObj.showShareSheet({
          // put your link properties here
          "feature" : "share",
        }, {
          // put your control parameters here
          "$deeplink_path" : "/matchup/" + matchupId,
        }, message);
      });
    }
  }
});
