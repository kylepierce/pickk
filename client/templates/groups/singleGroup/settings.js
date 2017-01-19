AutoForm.addHooks(['groupTeam'], {
  onSuccess: function(operation, result, template) {
    this.event.preventDefault();
    Router.go("/groups/invite/" + this.docId);
  }
});

Template.leagueAssociation.helpers({
  groupData: function(){
    return this.group[0]
  }
});
