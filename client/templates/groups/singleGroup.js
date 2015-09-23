Meteor.subscribe('leaderboard')

Template.singleGroup.created = function () {
  this.autorun(function () {
    this.subscription = Meteor.subscribe('groups', Router.current().params._id);
  }.bind(this));
};

// Template.singleGroup.rendered = function () {
//   this.autorun(function () {
//     if (!this.subscription.ready()) {
//       IonLoading.show();
//     } else {
//       IonLoading.hide();
//     }
//   }.bind(this));
// };

Template.singleGroup.helpers({
  group: function () {
    return Groups.findOne({_id: Router.current().params._id});
  }, 
  commissioner: function() {
    var commissionerId = this.commissioner
    var user = UserList.findOne({_id: commissionerId});
    return user
  },
  memberCount: function(){
    return this.members.length
  }, 
  private: function(){
    return this.secret
  },
  member: function(){
    var currentUserId = Meteor.userId();
    var groupMembers = Groups.findOne({_id: Router.current().params._id, members: currentUserId});

    if(groupMembers) {
      return true
    }
  }
});

Template.groupData.helpers({
  group: function () {
    return Groups.findOne({_id: Router.current().params._id});
  }, 
  commissioner: function() {
    var commissionerId = this.commissioner
    var user = UserList.findOne({_id: commissionerId});
    return user
  },
  memberCount: function(){
    return this.members.length
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
  'click .invite': function(event, template){
    groupId = Router.current().params._id
    console.log(groupId)
    Session.set('groupInvite', groupId);
  },
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