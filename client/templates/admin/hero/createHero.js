AutoForm.addHooks(['createHero'], {
  onSuccess: function(operation, result, template) {
    console.log(operation, result, template);
    this.event.preventDefault();
    // Router.go("/groups/association/" + result);
  }
});
