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
  userGroups: function() {
    var currentUser = Meteor.userId();
    return Groups.find({members: currentUser}).fetch()
  }
});

Template.groups.events({
  'click .newGroup': function () {
    console.log('Clicked the button')
    Router.go('/newgroup');
  }
});

Template.newGroup.events({
    'click input:checkbox':function(event, template){
      console.log(event.target)
     if($(event.target).is(':checked')){
          $(this).attr(true);
     }else{
          $(this).attr(false);
     }

      var privateCheck = event.target.value;
      console.log(privateCheck)
    },

    'submit form': function (event) {
      event.preventDefault();
      var groupId = event.target.groupId.value;
      var groupName = event.target.groupName.value;

      function hasWhiteSpace(s) {
        return /\s/g.test(s);
      }

      if(groupId.length < 5){
        IonLoading.show({
        customTemplate: '<h3>That name is not long enough :(</h3>',
        duration: 1500,
        backdrop: true
      });
    } else if(hasWhiteSpace(groupId)){
      IonLoading.show({
        customTemplate: '<h3>Group name can not have spaces :(</h3>',
        duration: 1500,
        backdrop: true
      });
    } else if(groupName.length < 5){
      IonLoading.show({
        customTemplate: '<h3>Group display name not long enough :(</h3>',
        duration: 1500,
        backdrop: true
      });
    }
    else if(Groups.findOne({'name': groupId})){
      IonLoading.show({
        customTemplate: '<h3>That name has been already taken :(</h3>',
        duration: 1500,
        backdrop: true 
      });
    } else {
      // Create the group with group name and privacy check the user passed
      Meteor.call('createGroup', groupId, groupName, false);

      // Show message on the screen that it was successfully created
      IonLoading.show({
        customTemplate: '<h3>You are the commissioner of ' + groupName + '</h3>',
        duration: 1500,
        backdrop: true
      });
    
    // Close
    Router.go('/groups');
    }
    // 
  }
});



