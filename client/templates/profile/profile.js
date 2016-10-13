Template.userProfile.helpers({
  trophies: function ( ) {
    var trophies = this.user.profile.trophies
    return trophies
  },
  groups: function () {
    var groups = this.user.profile.groups
    return groups
  },
  notOwnProfile: function ( userId ) {
    if ( userId !== Meteor.userId() ){
      return true
    }
  }
});

Template.displayTrophy.helpers({
  trophy: function (t) {
    Meteor.subscribe('trophy');
    var trophy = Trophies.findOne({_id: t})
    return trophy
  },
});

Template.displayGroup.helpers({
  group: function (g) {
    var group = Groups.findOne({_id: g})
    return group
  },
});

Template.followerCheck.helpers({
  alreadyFollower: function() {
    var currentUserId = Meteor.userId();
    var followers = this.user.profile.followers
    var alreadyFollower = followers.indexOf(currentUserId)
    if(alreadyFollower !== -1 ){
      return true
    }
  }
});

Template.followerCheck.events({
  'click [data-action=followUser]': function() {
    var currentUserId = Meteor.userId();
    var accountToFollow = Router.current().params._id
    
    // Add this user followers
    Meteor.call('followUser', currentUserId, accountToFollow);

  },
  'click [data-action=unfollowUser]': function() {
    var currentUserId = Meteor.userId();
    var accountToFollow = Router.current().params._id

    // Remove this user from followers
    Meteor.call('unfollowUser', currentUserId, accountToFollow);
  }
});
