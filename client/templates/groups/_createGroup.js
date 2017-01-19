AutoForm.addHooks(['createLeague'], {
  onSuccess: function(operation, result, template) {
    this.event.preventDefault();
    Router.go("/groups/association/" + result);
  }
});


// Template.newGroup.helpers({
//   CreateLeague: function(){
//     return CreateLeague
//   }
// });
