Meteor.methods({
	'activateDailyPickks': function(){
		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		activateDailyPickks();
	},
	'deactivateDailyPickks': function(){
		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		deactivateDailyPickks();
	},
});

// ------ Server functions - Cannot be direcctly called from the client ---------

activateDailyPickks = function () {
	console.log("Task complete");
	// Find all questions with "future" set them to "active"
	var futureQuestions = Questions.update({active: 'future'}, {$set: {active: true}}, {multi: true});
};

deactivateDailyPickks = function () {
	Questions.update({active: true}, {$set: {active: 'pending'}}, {multi: true});
}