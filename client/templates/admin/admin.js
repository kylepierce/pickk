// map multiple combinations to the same callback
Mousetrap.bind('d', function() {
	$('[data-action=deactivate]').click()
	return false;
}, 'keyup');

// Create question and add to database function
 
Template.createQuestion.helpers({
	game: function(){
		Meteor.subscribe('games');
		return Games.find({live: true}).fetch();
	},
	'commercial': function(){
		Meteor.subscribe('games');
		var game = Games.findOne({live: true});
		var commercialBreak = game.commercial
		return commercialBreak
	}
})

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
		var questions = QuestionList.find({ $and: [{active: null}, { atBatQuestion: { $ne: true }}]}, {sort: {dateCreated: -1}}).fetch();
		return questions
	},
	'binary': function(){
		if(this.binaryChoice == true){
			return true
		}
	},
	'binaryCommerical': function(question){
		if(this.commercial == true){
			return true
		}
	}
});

Template.atBatQuestion.helpers({
	'questions': function(){
		var questions = QuestionList.find({active: null, atBatQuestion: true}, {sort: {dateCreated: -1}}).fetch();
		return questions
	}
});

// Show all old questions
Template.oldQuestionList.helpers ({
	'questions': function(){
		Meteor.subscribe('oldQuestions')
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
	'click [data-action=editOption5]': function() {
		if(confirm("Are you sure?")) {
			var play = this.play
			Meteor.call('unAwardPoints', this._id, play)
			Meteor.call('modifyQuestionStatus', this._id, "option5");
		}
	},
	'click [data-action=editOption6]': function() {
		if(confirm("Are you sure?")) {
			var play = this.play
			Meteor.call('unAwardPoints', this._id, play)
			Meteor.call('modifyQuestionStatus', this._id, "option6");
		}
	},
	'click [data-action=permenantRemove]' : function() {
		if(confirm("Are you sure?")) {
			Meteor.call('unAwardPointsForDelete', this._id, this.play)
			Meteor.call('awardInitalCoins', this._id)
		}
	}
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
	// Find all buttons

	// Get their "value"
	'click .pending': function(event, template ) {
		var value = event.currentTarget.value 
		var optionNumber = event.currentTarget.getAttribute('data-action')
		if(value == "Hit"){
			var baseNumber = prompt('What Base?')
		}
		Meteor.call('nextPlay', value, baseNumber, optionNumber)
	},
	// It should match one of these options 

	//True False Questions
	'click [data-action=true]': function() {
		// Select the id of the button that is clicked
		var questionId = this._id;

		Meteor.call('modifyBinaryQuestionStatus', questionId, "option1");
		
	},
	'click [data-action=false]': function() {
		// Select the id of the button that is clicked
		var questionId = this._id;

		Meteor.call('modifyBinaryQuestionStatus', questionId, "option2");
	},

	'click [data-action=twoOption1]': function() {
		// Select the id of the button that is clicked
		var questionId = this._id;

		Meteor.call('modifyTwoOptionQuestionStatus', questionId, "option1");
	},

	'click [data-action=twoOption2]': function() {
		// Select the id of the button that is clicked
		var questionId = this._id;

		Meteor.call('modifyTwoOptionQuestionStatus', questionId, "option2");
	},

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
	'click [data-action=option5]': function() {
		// Select the id of the button that is clicked
		var questionId = this._id;

		Meteor.call('modifyQuestionStatus', questionId, "option5");
	},
	'click [data-action=option6]': function() {
		// Select the id of the button that is clicked
		var questionId = this._id;

		Meteor.call('modifyQuestionStatus', questionId, "option6");
	},
	'click [data-action=remove]' : function() {
		if(confirm("Are you sure?")) {
			Meteor.call('removeQuestion', this._id)
		}
	},
	'click [data-action=reactivate]' : function() {
		if(confirm("Are you sure?")) {
			Meteor.call('reactivateStatus', this._id)
		}
	}

});

// Select correct answer and award points to those who guessed correctly.
Template.atBatQuestion.events({
	// Find all buttons

	// Get their "value"

	'click [data-action=option1]': function() {
		// Select the id of the button that is clicked
		var questionId = this._id;
		Meteor.call('nextPlay', "Out")
	},
	'click [data-action=option2]': function() {
		// Select the id of the button that is clicked
		var questionId = this._id;
		Meteor.call('nextPlay', "Walk")
	},
	'click [data-action=option3]': function() {
		// Select the id of the button that is clicked
		var questionId = this._id;
		Meteor.call('nextPlay', "Hit", 1)
	},
	'click [data-action=option4]': function() {
		// Select the id of the button that is clicked
		var questionId = this._id;
		Meteor.call('nextPlay', "Hit", 2)
	},
	'click [data-action=option5]': function() {
		// Select the id of the button that is clicked
		var questionId = this._id;
		Meteor.call('nextPlay', "Hit", 3)
	},
	'click [data-action=option6]': function() {
		// Select the id of the button that is clicked
		var questionId = this._id;
		Meteor.call('nextPlay', "Hit", 4)
	},
	'click [data-action=remove]' : function() {
		if(confirm("Are you sure?")) {
			var moveOn = confirm('Do you want to move on to next player?')
      if( moveOn == true ) {
      	Meteor.call('increaseBatterCount')
      	Meteor.call('createAtBat') 
      }
      Meteor.call('updateAtBat', "Deleted")
			Meteor.call('endBattersAtBat', "Deleted")
			Meteor.call('removeQuestion', this._id)
		}
	},
	'click [data-action=reactivate]' : function() {
		if(confirm("Are you sure?")) {
			Meteor.call('reactivateStatus', this._id)
		}
	}

});

