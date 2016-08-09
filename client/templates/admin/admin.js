// map multiple combinations to the same callback
Mousetrap.bind('d', function() {
	$('[data-action=deactivate]').click()
	return false;
}, 'keyup');

// Create question and add to database function

Template.otherQuestions.helpers({
	'commercial': function(){
		var game = Games.findOne({live: true});
		var commercialBreak = game.commercial
		return commercialBreak
	}
});

Template.otherQuestions.events({
		'click [data-action="startCommercialBreak"]': function(event, template){
		// Turn off reload
		event.preventDefault();
		var game = Games.findOne({live: true});
		Meteor.call('toggleCommercial', game, true);
	},

	'click [data-action="createCommericalQuestion"]': function(event, template){
		// Turn off reload
		event.preventDefault();
		Meteor.call('createCommericalQuestion')
	},

	'click [data-action="endCommercialBreak"]': function(event, template){
		// Turn off reload
		event.preventDefault();
		var game = Games.findOne({live: true});
		Meteor.call('toggleCommercial', game, false);
	},

	'click [data-action="situationalQuestion"]': function(event, template){
		var que = prompt('Question you would like to ask')
		var game = Games.findOne({live: true});
		var gameId = game._id;
		Meteor.call('createTrueFalse', que, gameId)
	},
	'click [data-action="thisDrive"]': function(event, template){
		event.preventDefault();
		var down = template.find('input[name=down]').value
		var yards = template.find('input[name=yards]').value
		var area = template.find('input[name=area]').value
		var time = template.find('input[name=time]').value
		var gameId = template.find('#gameList :selected').value

		var question, option1, option2, option3, option4, option5, option6, multi1, multi2, multi3, multi4, multi5, multi6

		function questionList(o1, o2, o3, o4, o5, o6){
			option1 = o1
			option2 = o2
			option3 = o3
			option4 = o4
			option5 = o5
			option6 = o6
		}

		function randomizer(min, max){
			return (Math.random() * (max-min) + min).toFixed(2)
		}

		function multiplier(m1a, m1b, m2a, m2b, m3a, m3b, m4a, m4b, m5a, m5b, m6a, m6b){
			multi1 = randomizer(m1a, m1b)
			multi2 = randomizer(m2a, m2b)
			multi3 = randomizer(m3a, m3b)
			multi4 = randomizer(m4a, m4b)
			multi5 = randomizer(m5a, m5b)
			multi6 = randomizer(m6a, m6b)
		}

		question = "How Will This Drive End?"
		questionList("Punt", "Interception", "Fumble", "Touchdown", "Field Goal", "Other")

		multiplier(
						1.1, 1.3, 
						3.4, 5.42, 
						3.2, 4.81, 
						2.2, 4.81, 
						2.2, 4.81, 
						2.9, 4.61)

		// Meteor.call("questionPush", game, question)
		Meteor.call("emptyInactive", gameId, question)
		Meteor.call('insertQuestion', gameId, question, true, option1, multi1, option2, multi2, option3, multi3, option4, multi4, option5, multi5, option6, multi6);
 
	},
});

// Show pending questions
Template.pendingQuestions.helpers({
	'questions': function(){
		var questions = Questions.find({ $and: [{active: null}, { atBatQuestion: { $ne: true }}]}, {sort: {dateCreated: -1}}).fetch();
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

// Show all old questions
Template.oldQuestions.helpers ({
	'questions': function(){
		Meteor.subscribe('oldQuestions')
		return Questions.find({active: false}, {sort: {dateCreated: -1}, limit: 5});
	}
});
 
Template.oldQuestions.events({
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
// 		var question = Questions.findOne({_id: template.data.id});
// 		console.log(question)
// 	}
// });


// Select correct answer and award points to those who guessed correctly.
// Template.atBatQuestion.events({
// 	// Find all buttons

// 	// Get their "value"

// 	'click [data-action=option1]': function() {
// 		// Select the id of the button that is clicked
// 		var questionId = this._id;
// 		Meteor.call('nextPlay', "Out")
// 	},
// 	'click [data-action=option2]': function() {
// 		// Select the id of the button that is clicked
// 		var questionId = this._id;
// 		Meteor.call('nextPlay', "Walk")
// 	},
// 	'click [data-action=option3]': function() {
// 		// Select the id of the button that is clicked
// 		var questionId = this._id;
// 		Meteor.call('nextPlay', "Hit", 1)
// 	},
// 	'click [data-action=option4]': function() {
// 		// Select the id of the button that is clicked
// 		var questionId = this._id;
// 		Meteor.call('nextPlay', "Hit", 2)
// 	},
// 	'click [data-action=option5]': function() {
// 		// Select the id of the button that is clicked
// 		var questionId = this._id;
// 		Meteor.call('nextPlay', "Hit", 3)
// 	},
// 	'click [data-action=option6]': function() {
// 		// Select the id of the button that is clicked
// 		var questionId = this._id;
// 		Meteor.call('nextPlay', "Hit", 4)
// 	},
// 	'click [data-action=remove]' : function() {
// 		if(confirm("Are you sure?")) {
// 			var moveOn = confirm('Do you want to move on to next player?')
//       if( moveOn == true ) {
//       	Meteor.call('increaseBatterCount')
//       	Meteor.call('createAtBat') 
//       }
//       Meteor.call('updateAtBat', "Deleted")
// 			Meteor.call('endBattersAtBat', "Deleted")
// 			Meteor.call('removeQuestion', this._id)
// 		}
// 	},
// 	'click [data-action=reactivate]' : function() {
// 		if(confirm("Are you sure?")) {
// 			Meteor.call('reactivateStatus', this._id)
// 		}
// 	}

// });

