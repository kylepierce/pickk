
// Display active cards

Meteor.subscribe('activeQuestions');
Meteor.subscribe('userAnswer');
Meteor.subscribe('activeQuestions');


// this should be changed to startup. There might also be some additions for user types
Template.home.rendered = function (template) {
  if (!Meteor.loggingIn() && !Meteor.user()) {
   	 Router.go('/landing');
  }
};


Template.questionCard.helpers({
	'questions': function(){
		var currentUser = Meteor.userId();
		var questionsActive =  QuestionList.find(
				{active: true, 
				usersAnswered: {$nin: [currentUser]}}, 
				{sort: {dateCreated: 1,}});
		var questionId = this._id;

<<<<<<< HEAD
		return questionsActive;
=======
		return questionsActive
>>>>>>> parent of f621e3c... trying to fix collection bug
	}
});

Template.questionCard.events({
	'click input:radio[name=wager]':function(event, template) {
		var wager = template.find('input:radio[name=wager]:checked').value

		$("#submit-response").prop("disabled", false)
		$("#submit-response").addClass('button-balanced');
	},

	// 'click input:radio[name=play]':function(event, template) {
	// 	play = template.find('input:radio[name=play]:checked').value
	// },

	'submit form': function(event, template) {
		event.preventDefault();
		var questionId = this._id;
		var currentUser = Meteor.userId();
		var answer = template.find('input:radio[name=play]:checked').value;
		var wager = template.find('input:radio[name=wager]:checked').value;

		var userCoins = Meteor.user().profile.coins;
		if (userCoins < wager) {
			IonLoading.show({
      	customTemplate: '<h3>Not enough coins :(</h3><p>Lower the amount or purchase extra coins in our store</p>',
      	duration: 1500,
      	backdrop: true
    	});
		} else {

		// Add user data to question
		Meteor.call('questionAnswered', currentUser, questionId, answer, wager);

		console.log('User: ' + currentUser + ' answered question ' + questionId + ' -- ' + answer + ' ' + wager);
		
		}
	}
});