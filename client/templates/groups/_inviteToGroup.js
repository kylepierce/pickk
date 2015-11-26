Meteor.subscribe('groups');

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
		var user = this._id;
		var currentUser = Meteor.userId();
		var groupId = Session.get('groupInvite');
		Meteor.call("inviteToGroup", user, currentUser, groupId)
    var userData = UserList.findOne({_id: user})
    var username = userData.profile.username
    var groupData = Groups.findOne({_id: groupId})
    var groupName = groupData.name
    var message = username + " has invited you to join " + groupName
    Meteor.call('pushInvite', message, user);

    $("#" + user).addClass('button-balanced');
    $("#" + user).prop("disabled", true)
    $("#" + user).append(document.createTextNode("d"));
    sAlert.success("Invited " + username + " to " + groupName , {effect: 'slide', position: 'bottom', html: true});
	} 
})