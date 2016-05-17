Meteor.methods({
	'setActivationTime': function( currentTime, scheduleTime ) {


	},
	'activateDailyPickks': function(){
		// Find all questions with "future" set them to "active"
		var futureQuestions = QuestionList.update({active: 'future'}, {$set: {active: true}}, {multi: true})
	},
	'deactivateDailyPickks': function(){
		QuestionList.update({active: true}, {$set: {active: 'pending'}}, {multi: true})
	}
})