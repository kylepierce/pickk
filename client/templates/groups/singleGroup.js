// Template.singleGroup.created = function () {
//   this.autorun(function () {
//     var groupId = Router.current().params._id
//     this.subscription = Meteor.subscribe('groups', groupId) && Meteor.subscribe('findUserGroups', groupId)
//   }.bind(this));
// };

Template.singleGroup.helpers({
  group: function () {
    return Groups.findOne({_id: Router.current().params._id});
  }, 
  commissioner: function() {
    var commissionerId = this.commissioner
    Meteor.subscribe('findSingle', commissionerId)
    var user = UserList.findOne({_id: commissionerId});
    return user
  },
  memberCount: function(){
    return this.members.length
  }, 
  private: function(){
    var currentUser = Meteor.userId()
    var groupId = Router.current().params._id
    var group = Groups.findOne({_id: groupId})
    if (group.secret == "private") {
      return true
    } 
  },
  member: function(){
    var currentUserId = Meteor.userId();
    // Meteor.subscribe('profile', commissionerId)
    var groupMembers = Groups.findOne({_id: Router.current().params._id, members: currentUserId});
    if(groupMembers) {
      return true
    }
  },
  invite: function(){
    var currentUser = Meteor.userId()
    var groupId = Router.current().params._id
    var group = Groups.findOne({_id: groupId, 
      invites: {$in: [currentUser]}});
    return group 
  }
});
 
Template.groupData.helpers({
  group: function () {
    return Groups.findOne({_id: Router.current().params._id});
  }, 
  commissioner: function() {
    var commissionerId = this.commissioner
    Meteor.subscribe('findSingle', commissionerId)
    var user = UserList.findOne({_id: commissionerId});
    return user
  },
  memberCount: function(){
    return this.members.length
  },
  description: function(){
    return this.desc
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
  },   

  // Check to see if the current user is the commissioner.
  commissionerAdmin: function(){
    var currentUser = Meteor.userId()
    var groupId = Router.current().params._id
    var group = Groups.findOne({_id: groupId});
    
    if (group.commissioner == currentUser) {
      return true
    }
  },
  invite: function(){
    var currentUser = Meteor.userId()
    var groupId = Router.current().params._id
    var group = Groups.findOne({_id: groupId});
    
    if (group.secret == "invite") {
      return true
    }
  },
});

Template.memberCheck.events({
  'click [data-action=joinGroup]': function() {
    var currentUserId = Meteor.userId();
    var groupId = Router.current().params._id

    // Add this user to the group
    Meteor.call('joinGroup', currentUserId, groupId);
  },
  
  // If a user wants to leave it pops up with an alert to confirm.
  'click [data-action=showActionSheet]': function (event, template) {
    IonActionSheet.show({
      titleText: 'Are You Sure You Want To Leave?',
      buttons: [
        { text: 'Leave Group <i class="icon ion-share"></i>' },
      ],
      destructiveText: '',
      cancelText: 'Cancel',
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
          var currentUserId = Meteor.userId();
        var groupId = Router.current().params._id
        
        // Remove this user from the group
        Meteor.call('leaveGroup', currentUserId, groupId);
        var group = Groups.findOne({_id: groupId})
        var groupName = group.name
        sAlert.success("You Left " + groupName , {effect: 'slide', position: 'bottom', html: true});
        return true
        
        }
      }
    });
  }
});

Template.requestInvite.helpers({
  alreadyRequested: function () {
    var currentUser = Meteor.userId()
    var groupId = Router.current().params._id
    var group = Groups.findOne({_id: groupId, 
      requests: {$in: [currentUser]}});
    return group
  }
});

Template.inviteOnly.helpers({
  invite: function(){
    var currentUser = Meteor.userId()
    var groupId = Router.current().params._id
    var group = Groups.findOne({_id: groupId, 
      invites: {$in: [currentUser]}}, {fields: {invites: 1}});
    return group
  }
});

Template.requestInvite.events({
  'click [data-action=requestInvite]': function(template, event){
    var user = Meteor.userId();
    var group = Router.current().params._id
    Meteor.call('requestInvite', user, group)
  },
  'click [data-action=requestPending]': function(template, event){
    IonActionSheet.show({
      titleText: 'Are you sure you want to remove your group request?',
      buttons: [
        { text: 'Remove Request <i class="icon ion-share"></i>' },
      ],
      destructiveText: '',
      cancelText: 'Cancel',
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
          var user = Meteor.userId();
          var group = Router.current().params._id
          Meteor.call('removeRequest', user, group)
          return true
        }
      }
    });
  },
  'click [data-action=leaveGroup]': function (event, template) {
    IonActionSheet.show({
      titleText: 'Are You Sure You Want To Leave? You will need to request an invite or be invited to join again!',
      buttons: [
        { text: 'Leave Group <i class="icon ion-share"></i>' },
      ],
      destructiveText: '',
      cancelText: 'Cancel',
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
          var currentUserId = Meteor.userId();
          var groupId = Router.current().params._id
          
          // Remove this user from the group
          Meteor.call('leaveGroup', currentUserId, groupId);
          var group = Groups.findOne({_id: groupId})
          var groupName = group.name
          sAlert.success("You Left " + groupName , {effect: 'slide', position: 'bottom', html: true});
          return true
        
        }
      }
    });
  }
})

Template._adminOptions.helpers({
  invite: function(){
    var currentUser = Meteor.userId()
    var groupId = Router.current().params._id
    var group = Groups.findOne({_id: groupId});
    if (group.secret == "invite") {
      return true
    }
  },
});

Template._adminOptions.events({
  // Add group id to update group info.
  'click [data-ion-modal=_editGroup]': function(event, template){
    var groupId = Router.current().params._id
    Session.set('groupId', groupId);
  },

  // Add group id to update group info.
  'click [data-ion-modal=_removeUser]': function(event, template){
    var groupId = Router.current().params._id
    Session.set('groupId', groupId);
  },

  'click [data-ion-modal=_groupRequests]': function(event, template){
    var groupId = Router.current().params._id
    Session.set('groupId', groupId);
  },
  
  'click [data-action=deleteGroup]': function(event, template){
    IonPopover.hide();
    IonActionSheet.show({
      titleText: 'Are You Sure You Want To Delete Group? It can not be undone',
      buttons: [
        { text: 'Delete Group <i class="icon ion-share"></i>' },
      ],
      destructiveText: '',
      cancelText: 'Cancel',
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
        var groupId = Router.current().params._id
        Meteor.call('deleteGroup', groupId);
        Router.go('/groups');
        return true
        }
      }
    });

  }
})

Template.singleGroupLeaderboard.helpers({
  players: function(){ 
    var group = Groups.findOne()
    var members = group.members
    return members
  },
  userData: function (player) {
    return Meteor.users.findOne({_id: player});
  }
});
