Template.questionDetails.helpers({
  'reported': function(){
    if (this.questionReported){
      return true
    }
  }
});

Template.questionDetails.events({
  'click [data-action=report-question]': function(e, t){
    IonModal.open('_reportQuestion', this.question);
  }
});
