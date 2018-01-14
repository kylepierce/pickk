Template.inviteToLeague.helpers({
  following: function () {
    var user = Meteor.user();
    return user.profile.following
  },
  players: function(userId) {
  	var user = UserList.findOne({_id: userId});
  	return user
  }
  // inviteChecker: function(userId){
  //   var user = UserList.findOne({_id: userId}, {fields: "pendingNotifications.notificationId"});
  //   // var alreadyAsked = user.pendingNotifications.notificationId
  //   console.log(user)
  // }
});

Template.inviteButton.helpers({
  isInvited: function() {
    var invitee = this.__originalId
    if (!invitee) {
      var invitee = this._id
    }
    var group = Groups.findOne(Router.current().params._id);
    return ~group.invites.indexOf(invitee);
  }
});

Template.inviteButton.events({
	'click [data-action=invite]': function(e, t){
    var invitee = this.__originalId
    if (!invitee) {
      var invitee = this._id
      var username = this.user
    } else {
      var username = this.profile.username
    }
    var inviter = Meteor.userId()
    var leagueId = Router.current().params._id

    Meteor.call("inviteToLeague", invitee, inviter, leagueId);

    var groupData = Groups.findOne(Router.current().params._id)
    var groupName = groupData.name
    var message = Meteor.user().profile.username + " has invited you to join " + groupName
    var path = "/league/" + leagueId

    Meteor.call('pushInvite', "League", message, invitee, path);
    analytics.track("Invited to League", {
      userType: 'Existing User',
      location: "League",
      leagueId: leagueId,
    });

    $("#" + invitee).addClass('button-balanced');
    $("#" + invitee).prop("disabled", true)
    $("#" + invitee).append(document.createTextNode("d"));
    sAlert.success("Invited " + username + " to " + groupName , {effect: 'slide', position: 'bottom', html: true});
	}
})

Template.inviteToLeagueBox.helpers({
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

Template.inviteToLeagueBox.events({
  "click [data-action=textInvite]": function(e, t){
    if(Meteor.isCordova){
      var branchUniversalObj = null;
      var ref = Meteor.userId();
      var username = Meteor.user().profile.username
      var leagueId = Router.current().params._id
      var group = Groups.findOne(leagueId);
      var groupName = group.name
      var message = 'Predict the Next Play on Pickk! Click the Link to Join ' + groupName + ' (My League) and Compete Live!'

      analytics.track("Invited to App", {
        location: "League",
        leagueId: leagueId,
      });

      analytics.track("Invited to League", {
        userType: 'New User',
        location: "League",
        leagueId: leagueId,
      });

      Branch.createBranchUniversalObject({
        canonicalIdentifier: 'user-profile/'+ ref,
        title: 'League Invite!',
        contentDescription: message,
        contentMetadata: {
          'userId': ref,
          'userName': username,
          'leagueId': leagueId
        }
      }).then(function (newBranchUniversalObj) {
        branchUniversalObj = newBranchUniversalObj;
        branchUniversalObj.showShareSheet({
          // put your link properties here
          "feature" : "share",
        }, {
          // put your control parameters here
          "$deeplink_path" : "/league/" + leagueId,
        }, message);
      });
    }
  }
});
