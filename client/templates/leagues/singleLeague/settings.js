Template.memberSettings.helpers({
  notCommissioner: function(){
    var commissionerId = this.league.commissioner
    var userId = Meteor.userId();
    if (commissionerId !== userId){
      return true
    }
  }
});

Template.memberSettings.events({
  'click [data-action=leave]': function(){
    IonActionSheet.show({
      titleText: 'Are You Sure You Want To Leave League? If league is private you will have to be invited again.',
      buttons: [
        { text: 'Leave League <i class="icon ion-share"></i>' },
      ],
      destructiveText: '',
      cancelText: 'Cancel',
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
        var leagueId = Router.current().params._id
        Meteor.call('leaveLeague', Meteor.userId(), leagueId);
        Router.go('/leagues');
        return true
        }
      }
    });
  },
});

Template.commissionerSettings.helpers({
  commissioner: function(){
    var commissionerId = this.league.commissioner
    var userId = Meteor.userId();
    if (commissionerId === userId){
      return true
    }
  }
});

Template.commissionerSettings.events({
  'click [data-action=edit]': function(){
    IonModal.open('_editLeague');
  },
  'click [data-action=photo]': function(){
    Router.go("/league/settings/photo/" + this.league._id);
  },
  'click [data-action=association]': function(){
    Router.go("/league/association/" + this.league._id);
  },
  'click [data-action=delete]': function(){
    IonActionSheet.show({
      titleText: 'Are You Sure You Want To Delete League? It can not be undone',
      buttons: [
        { text: 'Delete League <i class="icon ion-share"></i>' },
      ],
      destructiveText: '',
      cancelText: 'Cancel',
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
        var leagueId = Router.current().params._id
        Meteor.call('deleteLeague', leagueId);
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
    return this.league
  }
});
