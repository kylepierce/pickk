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

Template.inviteButton.events({
	'click [data-action=invite]': function(event, template){
    var invitee = this.__originalId
    var inviter = Meteor.userId()
    var groupId = Router.current().params._id
    Meteor.call("inviteToGroup", invitee, inviter, groupId);

    var groupData = Groups.findOne(Router.current().params._id)
    var groupName = groupData.name
    var message = this.profile.username + " has invited you to join " + groupName
    // Meteor.call('pushInvite', message, this.__originalId);

    $("#" + this.__originalId).addClass('button-balanced');
    $("#" + this.__originalId).prop("disabled", true)
    $("#" + this.__originalId).append(document.createTextNode("d"));
    sAlert.success("Invited " + this.profile.username + " to " + groupName , {effect: 'slide', position: 'bottom', html: true});
	}
})

Template.inviteToGroupBox.helpers({
  UserListIndex: function() {
    return UserListIndex;
  },
  isInvited: function() {
    var group = Groups.findOne(Router.current().params._id);
    return ~group.invites.indexOf(this.__originalId);
  }
});
