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

//Displaying the different states of questions could be refactored.

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
 




// Deactivate question once the play has started.
Template.activeQuestionList.events({
	'click [data-action=deactivate]': function() {

		// Select the id of the yes button that is clicked
		var questionId = this._id;
		Meteor.call('deactivateStatus', questionId);
	}
});



// Select correct answer and award points to those who guessed correctly.
Template.pendingQuestionList.events({
	'click [data-action=run]': function() {
		// Select the id of the button that is clicked
		var questionId = this._id;

		Meteor.call('modifyQuestionStatus', questionId, "run");
		
	},
	'click [data-action=pass]': function() {
		// Select the id of the button that is clicked
		var questionId = this._id;

		Meteor.call('modifyQuestionStatus', questionId, "pass");
	},
	'click [data-action=interception]': function() {
		// Select the id of the button that is clicked
		var questionId = this._id;

		Meteor.call('modifyQuestionStatus', questionId, "interception");
	},
	'click [data-action=fumble]': function() {
		// Select the id of the button that is clicked
		var questionId = this._id;

		Meteor.call('modifyQuestionStatus', questionId, "fumble");
	}

});