AutoForm.addHooks('createQuestionTemplate', {
  onSuccess: function(doc) {
    sAlert.success("Created: ", {effect: 'slide', position: 'bottom', html: true});
    this.event.preventDefault();
  }
});
