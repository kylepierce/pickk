// Template.allGroups.created = function () {
//   this.autorun(function () {
//     this.subscription = Meteor.subscribe('groups', Router.current().params._id);
//   }.bind(this));
// };

// Template.allGroups.onCreated( function() {
//   this.subscribe( 'groups', function() {
//     $( ".loader" ).delay( 250).fadeOut( 'slow', function() {
//       $( ".loading-wrapper" ).fadeIn( 'slow' );
//     });
//   });
// });

// Template.allGroups.onRendered( function() {
//   $( "svg" ).delay( 500 ).fadeIn();
// });

Template.allGroups.helpers({
  group: function () {
    return Groups.find({}, {sort: {name: 1}}).fetch();
  }
});



