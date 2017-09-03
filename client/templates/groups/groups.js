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

Template.leaguesOverview.helpers({
  userLeague: function() {
    var currentUser = Meteor.userId();
    return Groups.find().fetch()
  },
  noLeaguesJoined: function(){
    var count = Groups.find().count()
    if(count === 0){
      return true
    }
  }
});

Template.leaguesOverview.events({
  'click .newGroup': function () {
    Router.go('/newgroup');
  },
  'click [data-action=no-group]': function (){
    Router.go('/allGroups')
  }
});

Template.leagueCard.events({
  "click [data-action=viewLeague]": function(e, t) {
    if (this.__originalId){
      var id = this.__originalId
    } else {
      var id = this._id
    }
    Router.go('group.show', {_id: id});
  }
});

Template.leagueCard.helpers({
  'joined': function(){
    if (this) {
      var userId = Meteor.userId();
      var alreadyJoined = this.members.indexOf(userId)
      if(alreadyJoined > -1){
        return "joined"
      }
    }
  },
  'commissioner': function(){
    if(this){
      var userId = this.commissioner
      Meteor.subscribe('findSingle', userId);
      var user = UserList.findOne({_id: userId});
      if (user) {
        return user.profile.username
      }
    }
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
