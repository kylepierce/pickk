// Template.groups.created = function () {
//   this.autorun(function () {
//     this.subscription = Meteor.subscribe('groups', Router.current().params._id);
//   }.bind(this));
// };

// Template.groups.onCreated( function() {
//   this.subscribe( 'groups', function() {
//     $( ".loader" ).delay( 1000 ).fadeOut( 'slow', function() {
//       $( ".loading-wrapper" ).fadeIn( 'slow' );
//     });
//   });
// });

// Template.groups.onRendered( function() {
//   $( "svg" ).delay( 750 ).fadeIn();
// });

// Template.groups.rendered = function () {
//   this.autorun(function () {
//     if (!this.subscription.ready()) {
//       IonLoading.show().delay(2000).hide(0);
//     } else {
//       IonLoading.hide();
//     }
//   }.bind(this));
// };

Template.groups.helpers({
  groups: function() {
    var currentUser = Meteor.user();
    return currentUser.profile.groups
  },
  userGroups: function() {
    var currentUser = Meteor.userId();
    return Groups.find().fetch()
  }
});

Template.groups.events({
  'click .newGroup': function () {
    Router.go('/newgroup');
  },
  'click [data-action=no-group]': function (){
    Router.go('/allGroups')
  }
});

Template.leagueItem.helpers({
  'joined': function(){
    // var userId = Meteor.userId();
    // var alreadyJoined = this.m.users.indexOf(userId)
    // if(alreadyJoined > -1){
    //   return "history-inprogress"
    // }
  },
  'commissioner': function(){
    // var groupId = matchup.groupId
    //
    // if(groupId){
    //   Meteor.subscribe('singleGroup', groupId);
    //   var group = Groups.find({_id: groupId}).fetch();
    //   var commissioner = group[0].name
    // } else {
    //   var userId = matchup.commissioner
    //   Meteor.subscribe('findSingle', userId);
    //   var user = UserList.findOne({_id: userId});
    //   if( user ){
    //     var commissioner = user.profile.username
    //   }
    // }
    // return commissioner
  },
  // 'username': function(ref) {
	// 	Meteor.subscribe('findSingle', ref);
  //   var user = UserList.findOne({_id: ref})
  //   if (user){
  //     return user.profile.username
  //   }
	// },
  // 'users': function (userArray){
  //   return userArray.length
  // },
  // 'limitNum': function(number){
  //   if(number === -1){
  //     return "∞"
  //   } else {
  //     return number
  //   }
  // }
});
