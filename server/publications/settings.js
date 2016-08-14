Meteor.publish('newUserQuestion', function (){
	return Questions.find({type: "onboarding"})
});