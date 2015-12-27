Template.sendEmail.events({
  'submit form': function (event) {
    event.preventDefault();
    var currentUser = Meteor.userId()
    var subject = event.target.subject.value;
    var message = event.target.messageBox.value;
    var html = event.target.htmlMessageBox.value;
    console.log(subject)
    console.log(message)
    console.log(html)
    Meteor.call('sendToMailingList', subject, message, html)
  },
  'click [data-action=addToList]': function(event){
    if(confirm("Are you sure?")) {
        Meteor.call('addAllEmailToList')
    }
  }, 
  'click [data-action=listAll]': function(event){
    if(confirm("Are you sure?")) {
        Meteor.call('listMembers')
    }
  }, 
});