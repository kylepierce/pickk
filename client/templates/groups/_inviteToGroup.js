Meteor.subscribe('leaderboard');

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
    
    $("#" + user).addClass('button-balanced');
    $("#" + user).prop("disabled", true)
	}
})