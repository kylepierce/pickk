Template.leagueSettings.events({
  'click [data-action=edit]': function(){
    IonModal.open('_editLeague');
  },
  'click [data-action=photo]': function(){
    Router.go("/league/settings/photo/" + this.group._id);
  },
  'click [data-action=association]': function(){
    Router.go("/league/association/" + this.group._id);
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
        Meteor.call('deleteLeague', groupId);
        Router.go('/leagues');
        return true
        }
      }
    });
  },
});

AutoForm.addHooks(['groupTeam'], {
  onSuccess: function(operation, result, template) {
    this.event.preventDefault();
    Router.go("/league/invite/" + this.docId);
  }
});

Template.leagueAssociation.helpers({
  groupData: function(){
    return this.group[0]
  }
});
