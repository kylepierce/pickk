Meteor.subscribe('groups')
Meteor.subscribe('trophies')

Template.myProfile.created = function () {
  this.autorun(function () {
    var userId = Router.current().params._id
    this.subscription = Meteor.subscribe('findSingle', userId);
  }.bind(this));
};

Template.myProfile.onRendered( function() {
  $( "svg" ).delay( 0 ).fadeIn();
});

Template.myProfile.onCreated( function() {
  this.subscribe( 'findSingle', function() {
    $( ".loader" ).delay( 100 ).fadeOut( 'fast', function() {
      $( ".loading-wrapper" ).fadeIn( 'fast' );
    });
  });
});


Template.myProfile.helpers({
  profile: function () {
    var userId = Meteor.userId(); 
    return UserList.findOne({_id: userId});
  },
  group: function() {
    var currentUser = Meteor.user();
    return currentUser.profile.groups
  },
  trophy: function() {
    return this.profile.trophies
  },
  trophyData: function(id){
    return Trophies.findOne({_id: id})
  },
  following: function(){
    var numFollowing = this.profile.following;
    var numCount = numFollowing.length
    if(!numCount){
      return 0
    } else {  
      return numCount
    }
  },
  follower: function(){
    var numFollow = this.profile.followers;
    var numCount = numFollow.length
    return numCount
    // if(numCount > 1){
    //   return numCount
    // } else{ 
    //   return 0
    // }
  }
});

Template.profileDisplayGroup.helpers({
  groupName: function(groupId){
    // Display the name of the group with the _id as refrence
    return Groups.findOne({_id: groupId, secret: false});
  }
});

