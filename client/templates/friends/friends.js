Template.friends.helpers({
  UserListIndex: function() {
    return UserListIndex;
  },
  isNotMe: function (userId) {
    return Meteor.userId() != userId;
  }
});

Template.friends.events({
  'click [data-action=invite]': function () {
    var userId = Meteor.userId()
    var username = Meteor.user().profile.username
    var url = "pick.co/download/?utm_campaign=friend-search&utm_content=" + username
    // Analytics
    analytics.track("Invite Friend", {
      userId: userId,
      location: "Find a Friend"
    });

    event.preventDefault();
    if (Meteor.isCordova) {
      window.plugins.socialsharing.shareWithOptions({
        message: Meteor.settings.public.share.message,
        url: 'http://bit.ly/download-pickk-app',
      });
    }
  }
});

Template.followButton.events({
  'click [data-action=follow]': function(event, template) {
    var user = this.__originalId;
    var currentUser = Meteor.userId();
    Meteor.call("followUser", currentUser, user)

    $("#" + user).addClass('button-balanced');
    $("#" + user).prop("disabled", true)
  }
})

Template.followButton.helpers({
  alreadyFollower: function() {
    var user = this.__originalId;
    var currentUserId = Meteor.userId();
    var accountToFollow = UserList.findOne({_id: currentUserId, "profile.following": user});
    // Check to see if user is in the group already. 
    if (accountToFollow) {
      return true
    }
  }
});
