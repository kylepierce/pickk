Template.gamePrediction.helpers({
	futureQuestion: function () {
		var list = QuestionList.find({gameId: "prediction", active: "future"}).fetch();
		return list
	},
	gameQuestion: function () {
		var list = QuestionList.find({gameId: "prediction", active: true}).fetch();
		return list
	},
	pendingGameQuestions: function () {
				var list = QuestionList.find({gameId: "prediction", active: "pending"}).fetch();
		return list
	}
});

Template.gamePrediction.events({
	'click [data-action=active]': function(){
		var gameId = this._id
		Meteor.call('activateGame', gameId);
	},

	'click [data-action=pending]': function(){
		var gameId = this._id
		Meteor.call('deactivateGame', gameId);
	},

	'click [data-action=schedule]': function() {
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
		Meteor.setTimeout(function(){
			Meteor.call('activateDailyPickks')
		}, timeUntilActivation);
	},

	'click [data-ion-popover=_gamePopover]': function(){
		console.log("Wow much popover very game")
		console.log(this._id)
		Session.set("gamePrediction", this._id);
	},

	'submit form': function (event, template) {
		// Get the value of the input box
		event.preventDefault();
		var team1 = template.find('#team1 :selected').text
		var team2 = template.find('#team2 :selected').text
		var question = team1 + " vs " + team2
		var game = "prediction"
		var op1, op2, op3, op4, op5, op6
		op1 = team1 + " Wins by 5+ runs"
		op2 = team1 + " Wins by 2-4 runs"
		op3 = team1 + " Wins by 1 run"
		op4 = team2 + " Wins by 1 run"
		op5 = team2 + " Wins by 2-4 runs"
		op6 = team2 + " Wins by 5+ runs"

		// game, que, commercial, op1, m1, op2, m2, op3, m3, op4, m4, op5, m5, op6, m6

		Meteor.call('insertQuestion', game, question, null, op1, 1, op2, 1, op3, 1, op4, 1, op5, 1, op6, 1, "future");
	}
});