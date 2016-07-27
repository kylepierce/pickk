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
  group: function () {
    return Groups.find({secret: false}).fetch();
  },
  groups: function() {
    var currentUser = Meteor.user();
    return currentUser.profile.groups
  },
  userGroups: function() {
    var currentUser = Meteor.userId();
    return Groups.find({members: currentUser}).fetch()
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
 



