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
    var alreadyInvited = matchup.invites.indexOf(invitee)
    if( alreadyInvited > -1 ){
      return true
    }
  }
});

Template.inviteMatchupButton.events({
	'click [data-action=invite]': function(e, t){
    var invitee = this._id
    if(!"user" in this){
      var user = UserList.findOne({_id: invitee})
      var username = user.profile.username
    } else {
      var username = this.user
    }
    var inviter = Meteor.userId()
    var matchupId = Router.current().params._id

    analytics.track("Invited to Matchup", {
      userType: 'Existing User',
      location: "Matchup",
      leagueId: matchupId,
    });

    Meteor.call("inviteToMatchup", invitee, inviter, matchupId);

    var matchupData = Matchup.findOne(matchupId)
    var message = Meteor.user().profile.username + " has challenged you to a matchup!"
    var deeplink = '/matchup/' + matchupId + "/?deeplinkAllowed=true"
    
    Meteor.call('pushInvite', "Matchup", message, invitee, deeplink);

    $("#" + invitee).addClass('button-balanced');
    $("#" + invitee).prop("disabled", true)
    $("#" + invitee).append(document.createTextNode("d"));
    sAlert.success("Invited " + username , {effect: 'slide', position: 'bottom', html: true});
	}
});

Template.inviteToMatchupBox.helpers({
  inputAttributes: function(){
    return {placeholder: "Search..."}
  },
  UserListIndex: function() {
    return UserListIndex;
  },
  followers: function(){
    var user = Meteor.user().profile.followers
    return user
  },
});

Template.inviteToMatchupBox.events({
  'click [data-action=finishMatchup]': function(e, t){
    analytics.track('Click "Skip"', {
      location: "Matchup",
      step: "Invite",
      text: "I Will Invite Friends Later"
    });
    var matchupId = Router.current().params._id
    Router.go('/matchup/' + matchupId + "?new=true");
  },
  "click [data-action=textInvite]": function(e, t){
    if(Meteor.isCordova){
      var branchUniversalObj = null;
      var ref = Meteor.userId();
      var username = Meteor.user().profile.username
      var matchupId = Router.current().params._id
      var matchup = Matchup.findOne(matchupId);

      var message = Meteor.user().profile.username + " has challenged you to a live game matchup!"

      analytics.track("Invited to App", {
        location: "Matchup",
        matchupId: matchupId
      });

      analytics.track("Invited to Matchup", {
        userType: 'New User',
        location: "Matchup",
        leagueId: matchupId,
      });

      var deeplink = '/matchup/' + matchupId + "/?deeplinkAllowed=true"
      Branch.createBranchUniversalObject({
        canonicalIdentifier: 'user-profile/'+ ref,
        title: 'Matchup Invite!',
        contentDescription: message,
        contentMetadata: {
          'userId': ref,
          '$deeplink_path': deeplink,
          'allowed': true,
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
          "$deeplink_path": deeplink,
        }, message);
      });
    }
  }
});
