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
	'click [data-action=value100]' : function(event, template){
		event.preventDefault();

		$('button').not(this).removeClass('button-energized');
		$(event.target).toggleClass("button-energized");

	},
	'click [data-action=value500]' : function(event, template){
		event.preventDefault();

		$('button').not(this).removeClass('button-energized');
		$(event.target).toggleClass("button-energized");

	},
	'click [data-action=value1000]' : function(event, template){
		event.preventDefault();

		$('button').not(this).removeClass('button-energized');
		$(event.target).toggleClass("button-energized");

	},

	'click [data-action=answerRun]': function(){
		event.preventDefault(); 
		var questionId = this._id;
		var currentUser = Meteor.userId();

		Session.set('answered', questionId);
		var answered = Session.get('answered');
		console.log(currentUser + " Answered Yes to question " + questionId);

		Meteor.call('questionAnswered', currentUser, answered, "run", 100);

	},
	'click [data-action=answerPass]': function(){
		event.preventDefault();
		var questionId = this._id;
		var currentUser = Meteor.userId();

		Session.set('answered', questionId);
		var answered = Session.get('answered');

		Meteor.call('questionAnswered', currentUser, answered, "pass", 100);
	},
	'click [data-action=answerFumble]': function(){
		event.preventDefault();
		var questionId = this._id;
		var currentUser = Meteor.userId();

		Session.set('answered', questionId);
		var answered = Session.get('answered');

		Meteor.call('questionAnswered', currentUser, answered, "fumble", 100);
	},
	'click [data-action=answerInterception]': function(){
		event.preventDefault();
		var questionId = this._id;
		var currentUser = Meteor.userId();

		Session.set('answered', questionId);
		var answered = Session.get('answered');

		Meteor.call('questionAnswered', currentUser, answered, "interception", 100);
	}
});