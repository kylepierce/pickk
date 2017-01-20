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
    if (group.secret == "invite" ) {
      return true
    }
  },
  maxed: function(){
    var group = Groups.findOne({_id: groupId});
    var numberOfUsers = group.members.length
    var max = group.limitNum
    if(max >= numberOfUsers){
      return true
    }
  }
});

Template.memberCheck.events({
  'click [data-action=joinGroup]': function() {
    var currentUserId = Meteor.userId();
    var groupId = Router.current().params._id
    var group = Groups.findOne({_id: groupId})
    var groupName = group.name
    sAlert.success("You Joined " + groupName , {effect: 'slide', position: 'bottom', html: true});
    // Add this user to the group
    Meteor.call('joinGroup', currentUserId, groupId);
  },
  'click [data-action=invite]': function(){
    var groupId = Router.current().params._id
    Router.go('/groups/invite/' + groupId)
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
  }
});

Template.requestInvite.events({
  'click [data-action=requestInvite]': function(e, t){
    var userId = Meteor.userId();
    var groupId = Router.current().params._id
    Meteor.call('requestInvite', userId, groupId)
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