Meteor.methods({
	'setActivationTime': function() {
		var d = new Date()
		var tomorrow = new Date()
		tomorrow.setDate(d.getDate() + 1)
		tomorrow.setHours(14, 0, 0, 0)
		var currentTime = d.toISOString();
		var tomorrow = tomorrow.toISOString()
		var currentTimeMilli = new Date(currentTime).getTime()
		var tomorrowMilli = new Date(tomorrow).getTime()
		var timeUntilActivation = tomorrowMilli - currentTimeMilli
		console.log(timeUntilActivation)
		return timeUntilActivation
	},
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
	'quickSchedule': function () {
		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		Meteor.setTimeout(function(){
			activateDailyPickks();
		}, 60);
	},
	'addTask': function(id, details) {
		check(id, String);
		check(details, {
			date: Date 			// CHECK - date object?
			// xyz: Match.Optional( String )		// If an optional object can be present
		});

		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}

		console.log(details)
		SyncedCron.add({
			name: id,
			schedule: function(parser) {
				console.log("Got it ")
				return parser.recur().on(details.date).fullDate();
			},
			job: function() {
				console.log("Ready to go!")
				Meteor.call('activateDailyPickks')
				FutureTasks.remove(id);
				SyncedCron.remove(id);
		    return id;
			}
		});
	},
	'scheduledDailyPickks': function(  ){
		if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
		}

		if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
		}
		
		function addMinutes(date, minutes) {
   		return new Date(date.getTime() + minutes*60000);
		}
		// var scheduledTime = Meteor.call('setActivationTime')
		var date = new Date() 
		console.log(date)
		var scheduledTime = addMinutes(date, 1)
		var details = { date: scheduledTime }
		console.log(details)
		if ( details.date < new Date() ){
			console.log("Ready to go!")
			Meteor.call('activateDailyPickks')
		} else {
			console.log("Setting it for the future")
			var thisId = FutureTasks.insert(details)
			var future = FutureTasks.find(thisId).fetch();
			Meteor.call('addTask', thisId, details);
		}
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