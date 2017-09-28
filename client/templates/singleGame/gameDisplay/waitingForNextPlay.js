Template.waitingForNextPlay.rendered = function () {
	var user = Meteor.user();
	var now = new Date().getTime();
	var days = 1000 * 60 * 60 * 24

	var tenDays = moment().subtract(10, 'days')._d.getTime();
	var lastAsked = user && user.profile.lastAsked
	var accountAge = user.createdAt.getTime()
	var numberOfDays = parseInt((now - accountAge) / days)
	var lastUpdate = new Date(Meteor.settings.public.appUpdate)
	var lastUpdateTime = lastUpdate.getTime();
	var game = Games.findOne()
	var playing = GamePlayed.findOne()
	if(playing){
		var queCounter = playing.queCounter
	}
	var commercial = game.commercial

	if(lastAsked){
		var lastAsked = lastAsked.getTime()
		var itsBeenAwhile = (tenDays - lastAsked) > 0
		var newVersion = parseInt((lastUpdateTime - lastAsked ) / days)
	}

	if (commercial === false){
		// console.log("Keep them in the game.")
	} else if (numberOfDays < 5){
		// console.log("Not Been Playing Long Enough")
	} else if(!lastAsked && queCounter > 15){
		console.log("First")
		addPrompt("First Time") // After 5 days.
	} else if (itsBeenAwhile && queCounter > 15) {
		console.log("Its Been A While")
		addPrompt("Its Been A While")
	} else if (newVersion >= 0 && queCounter > 15){
		console.log("New version")
		addPrompt("New Version")
	} else {
		// console.log("Didnt match anything")
	}

	var currentUserId = Meteor.userId();
	var game = Games.findOne();
	var gamePlayed = GamePlayed.findOne();
	var gameType = gamePlayed.type
	var selector = {
		active: true,
		usersAnswered: {$nin: [currentUserId]}
	}
	if (gameType === "live" && game.commercial === false){
		var finish = Chronos.moment().subtract(gamePlayed.timeLimit, "seconds").toDate();
		selector['dateCreated'] = {$gt: finish}
	} else if (gameType === "atbat" && game.commercial === false){
		var finish = Chronos.moment().subtract(gamePlayed.timeLimit, "seconds").toDate();
		selector['dateCreated'] = {$gt: finish}
	}
	var count = Questions.find(selector).count()
	if (count > 0){
		$('#waiting-for-play').hide();
		return true
	} else {
		$('#waiting-for-play').show();
		return false
	}
};

Template.waitingForNextPlay.helpers({
	currentBatter: function (){
		var currentBatter = this.game['eventStatus']['currentBatter']
		return "#" + currentBatter['uniform'] + " " + currentBatter['firstName'] + " " + currentBatter['lastName']
	},
	upNext: function(){
		var currentPosition = this.game['eventStatus']['inningDivision']
		if(currentPosition === "Top"){
			var currentBatter = this.game['home']['liveState']['nextUpBatters'][0]
			return "#" + currentBatter['uniform'] + " " + currentBatter['firstName'] + " " + currentBatter['lastName']
		} else {
			var currentBatter = this.game['away']['liveState']['nextUpBatters'][0]
			return "#" + currentBatter['uniform'] + " " + currentBatter['firstName'] + " " + currentBatter['lastName']
		}
	},
	drive: function(){
		var userId = Meteor.userId();
		var gameId = this.game._id
		var period = this.game.period
		var gamePlayed = GamePlayed.findOne({userId: userId, gameId: gameId, period: period});
		if (gamePlayed && gamePlayed.type === "drive"){
			return true
		}
	},
	periodDiff: function(){
		var userId = Meteor.userId();
		var gameId = this.game._id
		var period = this.game.period
		var gamePlayed = GamePlayed.findOne({userId: userId, gameId: gameId, period: period});
		if(gamePlayed === 0){
			return true
		}
	},
	data: function(){
		var userId = Meteor.userId();
		var gameId = this.game._id
		var period = this.game.period
		var gamePlayed = GamePlayed.findOne({userId: userId, gameId: gameId, period: period});
		var obj = {
			type: "game",
			_id: this.game._id,
			gameId: [this.game._id],
			period: [this.game.period],
			playType: gamePlayed.type,
			limit: 3
		}
		return obj
	}
});

Template.waitingForNextPlay.events({
	'click [data-action="nextPeriod"]': function(e,t){
		var gameId = t.data.game[0]._id
		Router.go('joinGame.show', {_id: gameId});
	},
	'click [data-action="switchToLive"]': function(e, t){
		var data = {
			userId: Meteor.userId(),
			gameId: this.game._id,
			period: this.game.period,
		}
		Meteor.call('switchToLive', data);
	},
	'click [data-action="filter-leaderboard"]': function(e,t){
		IonModal.open('_leaderboardFilter');
	},
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
		var obj = {enjoying: true, lastAsked: new Date()}
    var userId = Meteor.userId()
    analytics.track("answered enjoying",
    	{userId: userId, result: true});
    analytics.identify(userId, obj)
		if(Meteor.isCordova){
			//Intercom needs unix time with '_at' in JSON to work.
			var intercomData = {
				"answered_enjoy": true,
				"enjoying": true,
				"last_asked_enjoying_at": parseInt(Date.now() / 1000),
				"userId": Meteor.userId(),
			}
			updateIntercom(intercomData)
		}
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
    analytics.track("answered enjoying",
    	{userId: userId, result: false});
			if(Meteor.isCordova){
				//Intercom needs unix time with '_at' in JSON to work.
				var intercomData = {
					"answered_enjoy": true,
					"enjoying": false,
					"last_asked_enjoying_at": parseInt(Date.now() / 1000),
					"userId": Meteor.userId(),
				}
				updateIntercom(intercomData)
			}
		nextStep(data)
	},
	'click [data-action="yes-feedback"]': function (e,t) {
		var obj = {feedback: true, lastAsked: new Date()}
    var userId = Meteor.userId()
    analytics.identify(userId, obj)
    analytics.track("wants to give feedback",
    	{userId: userId, result: true});

		intercom.displayMessageComposerWithInitialMessage("My Suggestion to Improve Pickk: ");
		var data = {removeId: "feedbackPrompt"}
		if(Meteor.isCordova){
			//Intercom needs unix time with '_at' in JSON to work.
			var intercomData = {
				"answered_feedback": true,
				"feedback": true,
				"last_asked_feedback_at": parseInt(Date.now() / 1000),
				"userId": Meteor.userId(),
			}
			updateIntercom(intercomData)
		}
		removePrompt(data)
	},
	'click [data-action="no-feedback"]': function (e,t) {
		// "Lets not see this for 10 days."
		var obj = {feedback: false, lastAsked: new Date()}
    var userId = Meteor.userId()
    analytics.identify(userId, obj)
    analytics.track("answered feedback",
    	{userId: userId, result: false});
		var data = {removeId: "feedbackPrompt"}
		if(Meteor.isCordova){
			//Intercom needs unix time with '_at' in JSON to work.
			var intercomData = {
				"answered_feedback": true,
				"feedback": false,
				"last_asked_feedback_at": parseInt(Date.now() / 1000),
				"userId": Meteor.userId(),
			}
			updateIntercom(intercomData)
		}
		removePrompt(data)
	},
	'click [data-action="yes-review"]': function (e,t) {
		var obj = {review: true, lastAsked: new Date()}
    var userId = Meteor.userId()
    analytics.identify(userId, obj)
    analytics.track("answered review",
    	{userId: userId, result: true});

		var vendor = navigator.vendor
		if (Meteor.isCordova){
			if(vendor === "Apple Computer, Inc."){
				window.open('itms-apps://itunes.apple.com/app/viewContentsUserReviews/id995393750', '_system');
			} else if (vendor === "Google Inc.") {
				window.open("market://details?id=com.id5oyejxkvm3yq1jfiwr5", '_system');
			}
		}
		var data = {removeId: "reviewPrompt"}
		if(Meteor.isCordova){
			//Intercom needs unix time with '_at' in JSON to work.
			var intercomData = {
				"answered_review": true,
				"review": true,
				"last_asked_review_at": parseInt(Date.now() / 1000),
				"userId": Meteor.userId(),
			}
			updateIntercom(intercomData)
		}
		removePrompt(data)
	},
	'click [data-action="no-review"]': function (e,t) {
		var obj = {review: false, lastAsked: new Date()};
		var userId = Meteor.userId();
		var data = {removeId: "reviewPrompt"}
		analytics.identify(userId, obj)
		analytics.track("answered review",
    	{userId: userId, result: true});
		if(Meteor.isCordova){
			//Intercom needs unix time with '_at' in JSON to work.
			var intercomData = {
				"answered_review": true,
				"review": false,
				"last_asked_review_at": parseInt(Date.now() / 1000),
				"userId": Meteor.userId(),
			}
			updateIntercom(intercomData)
		}
		removePrompt(data)
	},
});

removePrompt = function (data){
	$("#" + data.removeId).addClass("slideOutRight")
	setTimeout(function() {
    $("#" + data.removeId).remove();
  }, 350);
  Meteor.call('ratingPrompt')
}

nextStep = function (data){
	$("#" + data.removeId).addClass("slideOutRight")

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

	analytics.track("shown enjoying", data);

	var container = $('#ratingBox')[0]
	Blaze.renderWithData(Template.ratingPrompt, data, container);
}
