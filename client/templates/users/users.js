Template.userProfile.helpers({
  group: function() {
    return this.profile.groups
  }, 
  trophy: function() {
    return this.profile.trophies
  },
  trophyData: function(id){
    return Trophies.findOne({_id: id})
  },
  ownProfile: function(){
    var userId = Router.current().params._id
    var currentUserId = Meteor.userId();
    if(userId !== currentUserId){
      return true 
    }
  }
});


Template.displayGroup.helpers({
  groupName: function(groupId){
    // Display the name of the group with the _id as refrence
    return Groups.findOne({_id: groupId, secret: false});
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
