
// Display active cards


Meteor.subscribe('userAnswer');


// this should be changed to startup. There might also be some additions for user types
Template.home.rendered = function () {
  if (!Meteor.loggingIn() && !Meteor.user()) {
   	 Router.go('/landing');
  }   
};

Template.questionCard.helpers({
	'questions': function(){
		Meteor.subscribe('activeQuestions');		
	}
});

Template.questionCard.events({
	'submit form': function(event, template) {
		event.preventDefault();
		var questionId = this._id;
		var currentUser = Meteor.userId();
		var answer = template.find('input:radio[name=play]:checked').value;
		var wager = template.find('input:radio[name=wager]:checked').value;

		// Add user data to question
		Meteor.call('questionAnswered', currentUser, questionId, answer, wager);

		console.log('User: ' + currentUser + ' answered question ' + questionId + ' -- ' + answer + ' ' + wager);
	}
});