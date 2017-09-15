Template._reportQuestion.helpers({
	reportQuestion: function(){
		return Schema.reportQuestion
	},
	answer: function(){
		var outcome = this.outcome
		var obj = this.options[outcome]
		return obj.title
	},
	questionOptions: function(){
		var list = _.map(this.options, function(option){
			return {label: option.title, value: option.option}
		});
		var deleteOption = {label: "Delete Question", value: "Delete"}
		list.push(deleteOption)
		return list
	},
	questionId: function(){
		return this._id
	}
});

AutoForm.hooks({
  reportQuestion: {
    onSubmit: function (insertDoc) {
      if (insertDoc) {
				sAlert.success("Thanks for reporting a question!" , {effect: 'slide', position: 'bottom', html: true});
				IonModal.close();
        this.done();
      } else {
        this.done(new Error("Submission failed"));
      }
      return false;
    }
  }
});

// Template._reportQuestion.events({
//
// });

Schema.reportQuestion = new SimpleSchema({
	correctAnswer: {
		label: "Select correct answer(s)",
		type: [String],
	},
	'correctAnswer.$': {
		type: String
	},
	questionId: {
		type: String
	},
	comment: {
		label: "Any comments?",
		type: String,
		optional: true
	},
	userId: {
    type: String,
    autoValue: function(){
      if ( this.isInsert ) {
        return this.userId
      }
    },
  },
  dateCreated: {
    type: Date,
    autoValue: function(){
      if ( this.isInsert ) {
        return new Date;
      }
     }
  },
});

QuestionReport.attachSchema([
	Schema.reportQuestion
]);
