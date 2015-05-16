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
		var questionsToAnswer =  QuestionList.find(
				{active: true, 
				usersRun: {$nin: [currentUser]}, 
				usersPass: {$nin: [currentUser]}, 
				usersFumble: {$nin: [currentUser]}, 
				usersInterception: {$nin: [currentUser]}}, 
				{sort: {dateCreated: 1,}});

		return questionsToAnswer
	}
});

Template.questionCard.events({

	//Session that saves users data until they hit submit.

	// Session.set({
	// 	questionAnswered: this._id,
	// 	optionChosen: ,
	// 	wager: 
	// });

	//Function that will store wager into a session

	'submit form': function(event) {
		event.preventDefault();
		var questionId = this._id
		var currentUser = Meteor.userId();
		var answer = event.target.play.value;
		var wager = event.target.wager.value;
		console.log('User: ' + currentUser + ' answered question ' + questionId + ' -- ' + answer + ' ' + wager);
	}

	//Function that stores option chosen to the session.



	//Submit the session to the database
	// 'submit form': function(){
	// 	console.log("Submitted!");
	// },

	// 'click [data-action=answerRun]': function(){
	// 	event.preventDefault(); 
	// 	var questionId = this._id;
	// 	var currentUser = Meteor.userId();

	// 	Session.set('answered', questionId);
	// 	var answered = Session.get('answered');
	// 	console.log(currentUser + " Answered Yes to question " + questionId);

	// 	Meteor.call('questionAnswered', currentUser, answered, "run", 100);

	// },
	// 'click [data-action=answerPass]': function(){
	// 	event.preventDefault();
	// 	var questionId = this._id;
	// 	var currentUser = Meteor.userId();

	// 	Session.set('answered', questionId);
	// 	var answered = Session.get('answered');

	// 	Meteor.call('questionAnswered', currentUser, answered, "pass", 100);
	// },
	// 'click [data-action=answerFumble]': function(){
	// 	event.preventDefault();
	// 	var questionId = this._id;
	// 	var currentUser = Meteor.userId();

	// 	Session.set('answered', questionId);
	// 	var answered = Session.get('answered');

	// 	Meteor.call('questionAnswered', currentUser, answered, "fumble", 100);
	// },
	// 'click [data-action=answerInterception]': function(){
	// 	event.preventDefault();
	// 	var questionId = this._id;
	// 	var currentUser = Meteor.userId();

	// 	Session.set('answered', questionId);
	// 	var answered = Session.get('answered');

	// 	Meteor.call('questionAnswered', currentUser, answered, "interception", 100);
	// }
});