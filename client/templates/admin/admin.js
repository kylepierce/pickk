Meteor.subscribe('questions');


// Create question and add to database function

Template.createQuestion.events({
	'click [data-action=normal-play]': function(){
		// Turn off reload
		event.preventDefault();
		Meteor.call('insertQuestion', "The next play will be ...", "Run", 1.5, "Pass", 1.6, "Interception", 2.5, "Fumble", 5.6);
	}, 	
	'click [data-action=kickoff-play]': function(){
		// Turn off reload
		event.preventDefault();
		Meteor.call('insertQuestion', "Kick off! ...", "Safety", 2.6, "Touchback", 1.3, "Touchdown", 6.2, "30+ Yards", 2.6);
	}, 
	'click [data-action=4th-down-play]': function(){
		// Turn off reload
		event.preventDefault();
		Meteor.call('insertQuestion', "Fourth Down ...", "Punt", 1.3, "Blocked Punt", 3.2, "Run", 3.5, "Pass", 4.6);
	}, 
	'click [data-action=point-after]': function(){
		// Turn off reload
		event.preventDefault();
		Meteor.call('insertQuestion', "Point after! ...", "Point After Good", 1.3, "Missed Kick", 3.5, "Run", 4.63, "2 Point Conversion", 8.23);
	}, 
});


// Deactivate question once the play has started.
Template.activeQuestionList.events({
	'click [data-action=deactivate]': function() {
		var questionId = this._id;
		Meteor.call('deactivateStatus', questionId);
	}
});



// Show all active questions
Template.activeQuestionList.helpers({
	'questions': function(){
		return QuestionList.find({active: true}, {sort: {dateCreated: 1}});
	}
});

// Show pending questions
Template.pendingQuestionList.helpers({
	'questions': function(){
		return QuestionList.find({active: null}, {sort: {dateCreated: 1}});
	}
});

// Show all old questions
Template.oldQuestionList.helpers({
	'questions': function(){
		return QuestionList.find({active: false}, {sort: {dateCreated: -1}, limit: 5});
	}
});
 
Template.oldQuestionList.events({
	'click [data-action=editOption1]': function() {
		if(confirm("Are you sure?")) {
			var play = this.play
			Meteor.call('unAwardPoints', this._id, play)
			Meteor.call('modifyQuestionStatus', this._id, "option1");
		}
	},
	'click [data-action=editOption2]': function() {
		if(confirm("Are you sure?")) {
			var play = this.play
			Meteor.call('unAwardPoints', this._id, play)
			Meteor.call('modifyQuestionStatus', this._id, "option2");
		}
	},
	'click [data-action=editOption3]': function() {
		if(confirm("Are you sure?")) {
			var play = this.play
			Meteor.call('unAwardPoints', this._id, play)
			Meteor.call('modifyQuestionStatus', this._id, "option3");
	}
	},
	'click [data-action=editOption4]': function() {
		if(confirm("Are you sure?")) {
			var play = this.play
			Meteor.call('unAwardPoints', this._id, play)
			Meteor.call('modifyQuestionStatus', this._id, "option4");
		}
	},
});

// Template._adminPopover.helpers({
// 	'option': function(){
// 		var template = Template.instance();
// 		console.log(template)
// 		var question = QuestionList.findOne({_id: template.data.id});
// 		console.log(question)
// 	}
// });


// Select correct answer and award points to those who guessed correctly.
Template.pendingQuestionList.events({
	'click [data-action=option1]': function() {
		// Select the id of the button that is clicked
		var questionId = this._id;

		Meteor.call('modifyQuestionStatus', questionId, "option1");
		
	},
	'click [data-action=option2]': function() {
		// Select the id of the button that is clicked
		var questionId = this._id;

		Meteor.call('modifyQuestionStatus', questionId, "option2");
	},
	'click [data-action=option3]': function() {
		// Select the id of the button that is clicked
		var questionId = this._id;

		Meteor.call('modifyQuestionStatus', questionId, "option3");
	},
	'click [data-action=option4]': function() {
		// Select the id of the button that is clicked
		var questionId = this._id;

		Meteor.call('modifyQuestionStatus', questionId, "option4");
	},
	'click [data-action=remove]' : function() {
		if(confirm("Are you sure?")) {
			Meteor.call('removeQuestion', this._id)
		}
	}

});


