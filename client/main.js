// Display active cards

Meteor.subscribe('activeQuestions');
Meteor.subscribe('userAnswer');

Template.questionCard.helpers({
	'questions': function(){
		var currentUser = Meteor.userId();
		var questionsToAnswer =  QuestionList.find({active: true, usersTrue: {$nin: [currentUser]}, 
		usersFalse: {$nin: [currentUser]}}, {sort: {dateCreated: 1,}});

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

	'click [data-action=answerYes]': function(){
		event.preventDefault(); 
		var questionId = this._id;
		var currentUser = Meteor.userId();

		Session.set('answered', questionId);
		var answered = Session.get('answered');
		console.log(currentUser + " Answered Yes to question " + questionId);

		Meteor.call('questionAnswered', currentUser, answered, true, 100);

	},
	'click [data-action=answerNo]': function(){
		event.preventDefault();
		var questionId = this._id;
		var currentUser = Meteor.userId();

		Session.set('answered', questionId);
		var answered = Session.get('answered');

		Meteor.call('questionAnswered', currentUser, answered, false, 100);
	}
});