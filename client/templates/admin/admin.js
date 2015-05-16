Meteor.subscribe('activeQuestions');


// Create question and add to database function

Template.createQuestion.events({
	'submit form': function(event){
		// Single page app so turn off reload
		event.preventDefault();

		var que = event.target.newQuestion.value;
		var game = event.target.game.value;

		Meteor.call('insertQuestion', que, game);

		// Reset form for single page app
		$("#question")[0].reset()
	}
});

// Show all active questions

Template.activeQuestionList.helpers({
	'questions': function(){
		
		return QuestionList.find({active: true}, {sort: {dateCreated: 1,}});
	}
});

// Show pending questions

Template.pendingQuestionList.helpers({
	'questions': function(){
		
		return QuestionList.find({active: null}, {sort: {dateCreated: 1,}});
	},

});

// Show all old questions

Template.oldQuestionList.helpers({
	'questions': function(){
		return QuestionList.find({active: false}, {sort: {dateCreated: -1,}});
	}
});
 




// Answer questions to make them true or false after they happen

Template.activeQuestionList.events({
	'click [data-action=deactivate]': function() {

		// Select the id of the yes button that is clicked
		var questionId = this._id;
		Session.set('answered', questionId);
		
		// Get the session
		var answered = Session.get('answered');

		// Update the database without losing any data
		Meteor.call('deactivateStatus', answered);
		
	}
});

Template.pendingQuestionList.events({
	'click [data-action=run]': function() {

		// Select the id of the yes button that is clicked
		var questionId = this._id;
		Session.set('answered', questionId);
		
		// Get the session
		var answered = Session.get('answered');

		// Update the database without losing any data
		Meteor.call('modifyQuestionStatus', answered, "run");
		
	},
	'click [data-action=pass]': function() {
		// Select the id of the yes button that is clicked
		var questionId = this._id;
		Session.set('answered', questionId);

		// Get the session
		var answered = Session.get('answered');

		// Update the database without losing any data
		Meteor.call('modifyQuestionStatus', answered, "pass");
	},
	'click [data-action=interception]': function() {
		// Select the id of the yes button that is clicked
		var questionId = this._id;
		Session.set('answered', questionId);

		// Get the session
		var answered = Session.get('answered');

		// Update the database without losing any data
		Meteor.call('modifyQuestionStatus', answered, "interception");
	},
	'click [data-action=fumble]': function() {
		// Select the id of the yes button that is clicked
		var questionId = this._id;
		Session.set('answered', questionId);

		// Get the session
		var answered = Session.get('answered');

		// Update the database without losing any data
		Meteor.call('modifyQuestionStatus', answered, "fumble");
	}

});