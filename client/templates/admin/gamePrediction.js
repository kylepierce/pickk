Template.gamePrediction.helpers({
	futureQuestion: function () {
		var list = Questions.find({type: "prediction", active: "future"}).fetch();
		return list
	},
	gameQuestion: function () {
		var list = Questions.find({type: "prediction", active: true}).fetch();
		return list
	},
	pendingGameQuestions: function () {
		var list = Questions.find({type: "prediction", active: "pending"}).fetch();
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

	'click [data-action=_gamePopover]': function(e,t){
		// Session.set("gamePrediction", this._id);
		IonPopover.show('_gamePopover', this, e.currentTarget)
	},

	'submit': function (event, template) {
		// Get the value of the input box
		event.preventDefault();
		var team1 = template.find('#team1 :selected').text
		var team2 = template.find('#team2 :selected').text

		// game, que, commercial, op1, m1, op2, m2, op3, m3, op4, m4, op5, m5, op6, m6

		var q = {
			que: team1 + " vs " + team2,
			options: {
				option1: {title: team1 + " Wins by 5+ runs", multiplier: 4},
				option2: {title: team1 + " Wins by 2-4 runs", multiplier: 4},
				option3: {title: team1 + " Wins by 1 run", multiplier: 4},
				option4: {title: team2 + " Wins by 1 run", multiplier: 4},
				option5: {title: team2 + " Wins by 2-4 runs", multiplier: 4},
				option6: {title: team2 + " Wins by 5+ runs", multiplier: 4}
			}
		}

		Meteor.call('gamePrediction', q);
	}
});
