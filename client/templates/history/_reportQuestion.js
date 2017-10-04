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
		var list = _.map(this.options, function(option, index){
			return {label: option.title, value: index}
		});
		var deleteOption = {label: "Delete Question", value: "Delete"}
		list.push(deleteOption)
		return list
	},
	questionId: function(){
		return this._id
	}
});

AutoForm.addHooks('reportQuestion', {
  onSuccess: function(doc) {
		if (doc) {
			sAlert.success("Thanks alerting us! We will take a look and give you an update." , {effect: 'slide', position: 'bottom', html: true});
			IonModal.close();
		}
  }
});

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
