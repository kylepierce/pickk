AutoForm.addHooks(['createLeague'], {
  onSuccess: function(operation, result, template) {
    this.event.preventDefault();
    Router.go("/league/settings/photo/" + result);
  }
});
