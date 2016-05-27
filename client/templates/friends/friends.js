Template.friends.helpers({
  UserListIndex: function() {
    return UserListIndex;
  }
});

Template.followButton.events({
  'click [data-action=follow]': function(event, template) {
    var user = this._id;
    var currentUser = Meteor.userId();
    Meteor.call("followUser", currentUser, user)

    $("#" + user).addClass('button-balanced');
    $("#" + user).prop("disabled", true)
  }
})

Template.followButton.helpers({
  alreadyFollower: function() {
    var user = this._id;
    var currentUserId = Meteor.userId();
    var accountToFollow = UserList.findOne({_id: currentUserId, "profile.following": user});
    // Check to see if user is in the group already. 
    if (accountToFollow) {
      return true
    }
  }
});
