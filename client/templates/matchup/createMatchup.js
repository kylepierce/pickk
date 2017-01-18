AutoForm.addHooks(['createMatchup'], {
  onSuccess: function(operation, result, template) {
    this.event.preventDefault();
    Router.go("/matchup/" + result);
  }
});

Template.createMatchup.helpers({
  
});
