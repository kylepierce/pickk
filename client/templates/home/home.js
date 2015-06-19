
// Display active cards

Meteor.subscribe('activeQuestions');
Meteor.subscribe('userAnswer');


// this should be changed to startup. There might also be some additions for user types
Template.home.rendered = function (template) {
  if (!Meteor.loggingIn() && !Meteor.user()) {
   	 Router.go('/landing');
  }
  $("#submit-response").prop("disabled", true);
  $("#submit-response").addClass("button-assertive");
};

Template.questionCard.helpers({
	'questions': function(){
		var currentUser = Meteor.userId();
		var questionsActive =  QuestionList.find(
				{active: true, 
				usersAnswered: {$nin: [currentUser]}}, 
				{sort: {dateCreated: 1,}});
		var questionId = this._id;

		return questionsActive;
	}
});

Template.questionCard.events({
	'click input:radio[name=wager]':function(event, template) {
		wager = template.find('input:radio[name=wager]:checked').value
		$("#submit-response").prop("disabled", false)
		$("#submit-response").addClass('button-balanced');
	},

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