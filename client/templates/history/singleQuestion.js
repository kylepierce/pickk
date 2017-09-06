Template.questionDetails.helpers({
});

Template.questionDetails.events({
  'click [data-action=report-question]': function(e, t){
    IonModal.open('_reportQuestion', this.question);
  }
});
