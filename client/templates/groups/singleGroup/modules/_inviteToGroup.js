Template.inviteToGroup.helpers({
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
      var username = UserList.find({_id: invitee}).fetch()[0].profile.username
    } else {
      var username = this.profile.username
    }
    var inviter = Meteor.userId()
    var groupId = Router.current().params._id

    Meteor.call("inviteToGroup", invitee, inviter, groupId);

    var groupData = Groups.findOne(Router.current().params._id)
    var groupName = groupData.name
    var message = Meteor.user().profile.username + " has invited you to join " + groupName

    // Meteor.call('pushInvite', message, this.__originalId);

    $("#" + invitee).addClass('button-balanced');
    $("#" + invitee).prop("disabled", true)
    $("#" + invitee).append(document.createTextNode("d"));
    sAlert.success("Invited " + username + " to " + groupName , {effect: 'slide', position: 'bottom', html: true});
	}
})

Template.inviteToGroupBox.helpers({
  UserListIndex: function() {
    return UserListIndex;
  },
  followers: function(){
    var user = Meteor.user().profile.followers
    return user
  },
});
