Template.waitingForNextPlay.rendered = function () {
	var user = Meteor.user();
	var now = new Date().getTime();
	var days = 1000 * 60 * 60 * 24

	var tenDays = moment().subtract(10, 'days')._d.getTime();
	var lastAsked = user && user.profile.lastAsked.getTime()
	var accountAge = user.createdAt.getTime()
	
	
	var itsBeenAwhile = (tenDays - lastAsked) > 0
	
	var numberOfDays = parseInt((now - accountAge) / days)
	var lastUpdate = new Date(Meteor.settings.public.appUpdate)
	var lastUpdateTime = lastUpdate.getTime();
	var newVersion = parseInt((lastAsked - lastUpdateTime) / days)
	var queCounter = GamePlayed.findOne().queCounter

	if (numberOfDays < 5){
		console.log("Not Been Playing Long Enough")
	} else if(!lastAsked && queCounter > 15){
		addPrompt("First Time") // After 5 days.
	} else if (newVersion >= 0 && queCounter > 15 || itsBeenAwhile && queCounter > 15) {
		addPrompt("New Version")
	}
};

Template.waitingForNextPlay.events({
	'click [data-action="yes-enjoy"]': function (e,t) {
		var data = {
			title: "Would Mind Rating Pickk?",
			id: "reviewPrompt",
			removeId: "feedbackPrompt",
			noAction: "no-review",
			noText: "No, Thanks",
			yesAction: "yes-review",
			yesText: "Ok, Sure"
		}
		var obj = {enjoying: false, lastAsked: new Date()}
    var userId = Meteor.userId()
    analytics.identify(userId, obj)
		nextStep(data)
	},
	'click [data-action="no-enjoy"]': function (e,t) {
		var data = {
			title: "Would Mind Giving Us Some Feedback?",
			id: "feedbackPrompt",
			removeId: "feedbackPrompt",
			noAction: "no-feedback",
			noText: "No, Thanks",
			yesAction: "yes-feedback",
			yesText: "Ok, Sure"
		}
		var obj = {enjoying: false, lastAsked: new Date()}
    var userId = Meteor.userId()
    analytics.identify(userId, obj)
		nextStep(data)
	},
	'click [data-action="yes-feedback"]': function (e,t) {
		// Update this code when you submit to the app submit to the app store.
		// Also Update from .11 to .19
		// intercom.displayMessageComposerWithInitialMessage("My Suggestion to Improve Pickk: ");
		var obj = {feedback: true, lastAsked: new Date()}
    var userId = Meteor.userId()
    analytics.identify(userId, obj)
    analytics.track("answered feedback", obj);

		intercom.displayMessageComposer();
		var data = {removeId: "feedbackPrompt"}
		removePrompt(data)
	},
	'click [data-action="no-feedback"]': function (e,t) {
		// "Lets not see this for 10 days."
		var obj = {feedback: false, lastAsked: new Date()}
    var userId = Meteor.userId()
    analytics.identify(userId, obj)
    analytics.track("answered feedback", obj);
		var data = {removeId: "feedbackPrompt"}
		removePrompt(data)
	},
	'click [data-action="yes-review"]': function (e,t) {
		var obj = {review: true, lastAsked: new Date()}
    var userId = Meteor.userId()
    analytics.identify(userId, obj)
    analytics.track("answered review", obj);

		var vendor = navigator.vendor 
		if (Meteor.isCordova){
			if(vendor === "Apple Computer, Inc."){
				window.open('itms-apps://itunes.apple.com/app/viewContentsUserReviews/id995393750', '_system');
			} else if (vendor === "Google Inc.") {
				window.open("market://details?id=com.id5oyejxkvm3yq1jfiwr5", '_system');
			}
		}
		var data = {removeId: "reviewPrompt"}
		removePrompt(data)	
	},
	'click [data-action="no-review"]': function (e,t) {
		var obj = {review: false, lastAsked: new Date()}
		var data = {removeId: "reviewPrompt"}
		analytics.track("answered review", data);
		removePrompt(data)
	},
});

removePrompt = function (data){
	$("#" + data.removeId).addClass("slideOutRight")
	setTimeout(function() {
    $("#" + data.removeId).remove();
  }, 350);
  // Meteor.call('ratingPrompt')
}

nextStep = function (data){
	$("#" + data.removeId).addClass("slideOutRight")
	analytics.track("answered enjoying", data);
	setTimeout(function() {
		var container = $('#ratingBox')[0]
		$("#" + data.removeId).remove();
    Blaze.renderWithData(Template.ratingPrompt, data, container)
  }, 350);
}

addPrompt = function (when){
	var data = {
		title: "Are You Enjoying Playing Pickk?",
		id: "feedbackPrompt",
		noAction: "no-enjoy",
		noText: "Not Really",
		yesAction: "yes-enjoy",
		yesText: "Yes!",
		when: when
	}

	var container = $('#ratingBox')[0]
	Blaze.renderWithData(Template.ratingPrompt, data, container);
}