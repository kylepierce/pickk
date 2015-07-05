Template.groups.created = function () {
  this.autorun(function () {
    this.subscription = Meteor.subscribe('groups', Router.current().params._id);
  }.bind(this));
};

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
    return Groups.find({}).fetch();
  },
  userGroups: function() {
    var currentUser = Meteor.userId();
    return Groups.find({"member": currentUser}).fetch()
  }
});

Template.newGroup.events({
    'submit form': function (event) {
      event.preventDefault();
    var groupName = event.target.groupName.value;
    var privateCheck = event.target.privateCheck.value;



    if(Groups.findOne({'name': groupName})){
      IonLoading.show({
        customTemplate: '<h3>That name has been already taken :(</h3>',
        duration: 1500,
        backdrop: true
      });
    } else {
      // Create the group with group name and privacy check the user passed
      Meteor.call('createGroup', groupName, privateCheck);

      // Show message on the screen that it was successfully created
      IonLoading.show({
        customTemplate: '<h3>You are the commissioner of ' + groupName + '</h3>',
        duration: 1500,
        backdrop: true
      });
    
    // Close the model box

    }
    // 
  }
})