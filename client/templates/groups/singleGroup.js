Template.singleGroup.created = function () {
  this.autorun(function () {
    this.subscription = Meteor.subscribe('groups', Router.current().params._id);
  }.bind(this));
};

Template.singleGroup.rendered = function () {
  this.autorun(function () {
    if (!this.subscription.ready()) {
      IonLoading.show();
    } else {
      IonLoading.hide();
    }
  }.bind(this));
};

Template.singleGroup.helpers({
  group: function () {
    return Groups.findOne({_id: Router.current().params._id});
  }
});

Template.memberCheck.helpers({
  alreadyMember: function() {
    var currentUserId = Meteor.userId();
    var groupMembers = Groups.findOne({_id: Router.current().params._id, members: currentUserId});
    
    // Check to see if user is in the group already. 
    if(groupMembers) {
      return true
    } 
  }
});

Template.singleGroup.events({
  'click [data-action=joinGroup]': function() {
    var currentUserId = Meteor.userId();
    var groupId = Router.current().params._id

    // Add this user to the group
    Meteor.call('joinGroup', currentUserId, groupId);

  },
  'click [data-action=leaveGroup]': function() {
    var currentUserId = Meteor.userId();
    var groupId = Router.current().params._id

    // Remove this user from the group
    Meteor.call('leaveGroup', currentUserId, groupId);

  }
})