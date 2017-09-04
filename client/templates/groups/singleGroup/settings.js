Template.leagueSettings.events({
  'click [data-action=edit]': function(){
    IonModal.open('_editGroup');
  },
  'click [data-action=photo]': function(){
    Router.go("/league/settings/photo/" + this.group._id);
  },
  'click [data-action=association]': function(){
    Router.go("/groups/association/" + this.group._id);
  },
  'click [data-action=delete]': function(){
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
        console.log(groupId);
        Meteor.call('deleteLeague', groupId);
        Router.go('/groups');
        return true
        }
      }
    });
  },
});

AutoForm.addHooks(['groupTeam'], {
  onSuccess: function(operation, result, template) {
    console.log(operation, result, template);
    this.event.preventDefault();
    Router.go("/groups/invite/" + this.docId);
  }
});

Template.leagueAssociation.helpers({
  groupData: function(){
    return this.group[0]
  }
});
