Meteor.subscribe('activeQuestions');


// Create question and add to database function

Template.createQuestion.events({
	'submit form': function(event){
		// Single page app so turn off reload
		event.preventDefault();

		var que = event.target.newQuestion.value;
		var teamOne = event.target.teamOne.value;
		var teamTwo = event.target.teamTwo.value;

		Meteor.call('insertQuestion', que, teamOne, teamTwo);

		// Reset form for single page app
		$("#question")[0].reset()
	}
});

// Show all active questions

Template.activeQuestionList.helpers({
	'questions': function(){
		return QuestionList.find({active: true});
	}
});

// Show all old questions

Template.oldQuestionList.helpers({
	'questions': function(){
		return QuestionList.find({active: false});
	}
});





// Answer questions to make them true or false after they happen

Template.activeQuestionList.events({
	'click [data-action=questionTrue]': function() {

		// Select the id of the yes button that is clicked
		var questionId = this._id;
		Session.set('answered', questionId);
		
		// Get the session
		var answered = Session.get('answered');

		// Update the database without losing any data
		Meteor.call('modifyQuestionStatus', answered, true);
		
	},
	'click [data-action=questionTrue]': function() {
		// Select the id of the yes button that is clicked
		var questionId = this._id;
		Session.set('answered', questionId);

		// Get the session
		var answered = Session.get('answered');

		// Update the database without losing any data
		Meteor.call('modifyQuestionStatus', answered, false);
	}

});