// Display active cards

Meteor.subscribe('activeQuestions');
Meteor.subscribe('userAnswer');

Template.home.rendered = function () {
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

		return questionsActive;
	}
});

Template.questionCard.events({

	//Function that will store wager into a session

	'submit form': function(event) {
		event.preventDefault();
		var questionId = this._id;
		var currentUser = Meteor.userId();
		var answer = event.target.play.value;
		var wager = event.target.wager.value;

		//Reduce players coins by wager

		Meteor.call('takeCoins', currentUser, questionId, wager);

		//Add user data to question
		Meteor.call('questionAnswered', currentUser, questionId, answer, wager);

		console.log('User: ' + currentUser + ' answered question ' + questionId + ' -- ' + answer + ' ' + wager);
	}
});