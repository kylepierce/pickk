Meteor.subscribe('groups')

Template.userProfile.created = function () {
  this.autorun(function () {
    this.subscription = Meteor.subscribe('profile', Router.current().params._id);
  }.bind(this));
};

// Template.userProfile.rendered = function () {
//   this.autorun(function () {
//     if (!this.subscription.ready()) {
//       IonLoading.show();
//     } else {
//       IonLoading.hide();
//     }
//   }.bind(this));
// };

Template.userProfile.helpers({
  profile: function () {
    return UserList.findOne({_id: Router.current().params._id});
  },
  group: function() {
    return this.profile.groups
  },
  following: function(){
    var numFollowing = this.profile.following;
    return numFollowing.length
  },
  follower: function(){
    var numFollow = this.profile.followers;
    return numFollow.length
  }
});


Template.displayGroup.helpers({
  groupName: function(groupId){
    // Display the name of the group with the _id as refrence
    return Groups.findOne({_id: groupId});
  }
});

Template.followerCheck.helpers({
  alreadyFollower: function() {
    var currentUserId = Meteor.userId();
    var accountToFollow = UserList.findOne({_id: Router.current().params._id,  "profile.followers": currentUserId});
    // Check to see if user is in the group already. 
    if(accountToFollow) {
      return true
    } 
  }
});

Template.followerCheck.events({
  'click [data-action=followUser]': function() {
    var currentUserId = Meteor.userId();
    var accountToFollow = Router.current().params._id
    
    // Add this user to the group
    Meteor.call('followUser', currentUserId, accountToFollow);

  },
  'click [data-action=unfollowUser]': function() {
    var currentUserId = Meteor.userId();
    var accountToFollow = Router.current().params._id

    // Remove this user from the group
    Meteor.call('unfollowUser', currentUserId, accountToFollow);

  }
});