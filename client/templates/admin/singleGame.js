// Template.singleGameAdmin.rendered = function() {
//     console.log(this.data); // you should see your passage object in the console
// };

// Deactivate question once the play has started.
Template.activeQuestions.events({
	'click [data-action=deactivate]': function() {
		var questionId = this._id;
		Meteor.call('deactivateStatus', questionId);
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
		return Questions.find({active: null}, {sort: {dateCreated: -1}})
	},
});

Template.pendingQuestion.helpers({
	questionOptions: function (q) {
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

// Template.oldQuestions.helpers({
// 	questions: function () {
// 		return Questions.find({active: false}, {sort: {dateCreated: -1}, {limit: 3}})
// 	}
// });

// Template.oldQuestion.helpers({
// 	questionOptions: function (q) {
// 	  var imported = q
// 	  var data = q.options
// 	  var keys = _.keys(data)
// 	  var values = _.values(data)
// 	  var optionsArray = []

// 	  // [{number: option1}, {title: Run}, {multiplier: 2.43}]

// 	  for (var i = 0; i < keys.length; i++) {
// 	    var obj = values[i]
// 	    var number = keys[i]
// 	    obj["option"] = number 
// 	    optionsArray.push(obj)
// 	  }

// 	  return optionsArray
// 	}
// });


// // Select correct answer and award points to those who guessed correctly.
// Template.oldQuestion.events({
// 	'click [data-action=removeQuestion]' : function(e, t) {
// 		if(confirm("Are you sure?")) {
// 			Meteor.call('removeQuestion', this.q._id)
// 		}
// 	},
// 	'click [data-action=reactivate]' : function(e, t) {
// 		if(confirm("Are you sure?")) {
// 			Meteor.call('reactivateStatus', this.q._id)
// 		}
// 	},
// 	'click [data-action=playSelection]': function (e, t) {
// 		Meteor.call('modifyQuestionStatus', this.q._id, this.o.option)
// 	}
// });