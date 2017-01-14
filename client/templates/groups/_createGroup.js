AutoForm.addHooks(['createLeague'], {
  onSuccess: function(operation, result, template) {
    this.event.preventDefault();
    // console.log(operation, result, template);
    //
    // var group = Groups.find({_id: result}).fetch()
    // console.log(group, groupName);
    // var groupName = group[0].name
    //
    // IonLoading.show({
    //   customTemplate: '<h3>You are the commissioner of ' + groupName + '!</h3>',
    //   duration: 2500,
    //   backdrop: true
    // });

    Router.go("/groups/" + result);
  }
});


// Template.newGroup.helpers({
//   CreateLeague: function(){
//     return CreateLeague
//   }
// });
