Template.singleGameAdmin.helpers({
	game: function () {
		var game = this.game[0]
		return game
	},
	football: function () {
		var game = this.game[0]
		if (game.football === true){
			return true
		}
	}
});

// Create question and add to database function
Template.otherQuestions.events({
	'click [data-action="startCommercialBreak"]': function(event, template){
		// Turn off reload
		event.preventDefault();
		var gameId = Router.current().params._id
		Meteor.call('toggleCommercial', gameId, true);
	},

	'click [data-action="endCommercialBreak"]': function(event, template){
		// Turn off reload
		event.preventDefault();
		var gameId = Router.current().params._id
		Meteor.call('toggleCommercial', gameId, false);
	},

	'click [data-action="thisDrive"]': function(e, t){
		event.preventDefault();
		var gameId = Router.current().params._id

		// One object to be passed to the insertQuestion method.
		var q = {
			gameId: gameId,
			type: "drive",
			commercial: true,
			inputs: {}
		}

		Meteor.call('insertQuestion', q, function(e, r){
			if(!e){
				Meteor.call("questionPush", q.gameId, r)
				Meteor.call("emptyInactive", q.gameId)
			}
		});
	},
});

Template.otherQuestions.helpers({
	'commercial': function(){
		var gameId = Router.current().params._id
		var game = Games.findOne({_id: gameId});
		var commercialBreak = game.commercial
		return commercialBreak
	}
});

// Deactivate question once the play has started.
Template.futureQuestions.events({
	'click [data-action=activate]': function() {
		var questionId = this._id;
		Meteor.call('reactivateStatus', questionId);
	},
	'click [data-action=edit]': function(e, t){
		sAlert.success("Deactivated Question For Edit." , {effect: 'slide', position: 'bottom', html: true});
		IonModal.open('_editQuestion', this);
	}
});

// Show all active questions
Template.futureQuestions.helpers({
	'questions': function(){
		return Questions.find({active: "future"}, {sort: {dateCreated: -1}});
	}
});

// Deactivate question once the play has started.
Template.activeQuestions.events({
	'click [data-action=deactivate]': function() {
		Meteor.call('deactivateStatus', this._id);
	},
	'click [data-action=edit]': function(e, t){
		sAlert.success("Deactivated Question For Edit." , {effect: 'slide', position: 'bottom', html: true});
		Meteor.call('deactivateStatus', this._id);
		IonModal.open('_editQuestion', this);
	}
});

// Show all active questions
Template.activeQuestions.helpers({
	'questions': function(){
		return Questions.find({active: true}, {sort: {dateCreated: -1}});
	}
});

Template.pendingQuestions.helpers({
	questions: function () {
		return Questions.find({active: null}, {sort: {dateCreated: -1}}).fetch()
	},
	'click [data-action=edit]': function(e, t){
		sAlert.success("Deactivated Question For Edit." , {effect: 'slide', position: 'bottom', html: true});
		IonModal.open('_editQuestion', this);
	}
});

Template.pendingQuestion.helpers({
	options: function (q) {
	  var imported = q
	  var data = q.options
	  var keys = _.keys(data)
	  var values = _.values(data)
	  var optionsArray = []

	  // [{number: option1}, {title: Run}, {multiplier: 2.43}]

	  for (var i = 0; i < keys.length; i++) {
	    var obj = values[i]
	    var number = keys[i]
	    obj["option"] = number 
	    optionsArray.push(obj)
	  }

	  return optionsArray
	}
});

// Select correct answer and award points to those who guessed correctly.
Template.pendingQuestion.events({
	'click [data-action=edit]': function(e, t){
		sAlert.success("Deactivated Question For Edit." , {effect: 'slide', position: 'bottom', html: true});
		Meteor.call('deactivateStatus', this._id);
		IonModal.open('_editQuestion', this.q);
	},
	'click [data-action=removeQuestion]' : function(e, t) {
		if(confirm("Are you sure?")) {
			Meteor.call('removeQuestion', this.q._id)
		}
	},
	'click [data-action=reactivate]' : function(e, t) {
		if(confirm("Are you sure?")) {
			Meteor.call('reactivateStatus', this.q._id)
		}
	},
	'click [data-action=playSelection]': function (e, t) {
		Meteor.call('modifyQuestionStatus', this.q._id, this.o.option)
	}
});

Template.oldQuestions.helpers({
	questions: function () {
		var question = Questions.find({active: false}, {sort: {lastUpdated: -1, dateCreated: -1}, limit: 5}).fetch()
		return question
	}
});

Template.oldQuestion.helpers({
	options: function (q) {
	  var imported = q
	  var data = q.options
	  var keys = _.keys(data)
	  var values = _.values(data)
	  var optionsArray = []

	  // [{number: option1}, {title: Run}, {multiplier: 2.43}]
	  for (var i = 0; i < keys.length; i++) {
	    var obj = values[i]
	    var number = keys[i]
	    obj["option"] = number 
	    optionsArray.push(obj)
	  }

	  return optionsArray
	}
});

// Select correct answer and award points to those who guessed correctly.
Template.oldQuestion.events({
	'click [data-action=removeQuestion]' : function(e, t) {
		if(confirm("Are you sure?")) {
			Meteor.call('unAwardPoints', this.q._id, this.q.outcome)
			Meteor.call('removeQuestion', this.q._id)
		}
	},
	'click [data-action=reactivate]' : function(e, t) {
		if(confirm("Are you sure?")) {
			Meteor.call('reactivateStatus', this.q._id)
		}
	},
	'click [data-action=playSelection]': function (e, t) {
		Meteor.call('unAwardPoints', this.q._id, this.q.outcome)
		Meteor.call('modifyQuestionStatus', this.q._id, this.o.option)
	}
});