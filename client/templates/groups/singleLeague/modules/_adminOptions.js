
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
  'click [data-action=_editLeague]': function(e, t){
    IonModal.open('_editLeague');
  },
  'click [data-action=assocation]': function(){
    var groupId = Router.current().params._id
    IonPopover.hide()
    Router.go("/groups/association/" + groupId)
  },

  // Add group id to update group info.
  'click [data-action=_removeUser]': function(event, template){
    var groupId = Router.current().params._id
    IonPopover.hide()
    Router.go('/groups/members/'+groupId)
  },

  'click [data-ion-modal=_leagueRequests]': function(event, template){
    var groupId = Router.current().params._id
    Session.set('groupId', groupId);
  },

  'click [data-action=deleteLeague]': function(event, template){
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
        Meteor.call('deleteLeague', groupId);
        Router.go('/groups');
        return true
        }
      }
    });
  }
});
