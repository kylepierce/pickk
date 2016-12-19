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
	'click [data-action=active]': function(e,t){
		var gameId = this._id
		Meteor.call('activateGame', gameId);
	},

	'click [data-action=pending]': function(){
		var gameId = this._id
		Meteor.call('deactivateGame', gameId);
	},

	'click [data-action=_gamePopover]': function(e,t){
		IonPopover.show('_gamePopover', this, e.currentTarget)
	},

	'submit': function (event, template) {
		// Get the value of the input box
		event.preventDefault();
		var now = moment();
		var dateSpelled = moment(now,"MM/DD/YYYY", true).format("MMM Do YYYY");
		var title = dateSpelled + " Predictions"
		var game = Games.findOne({name: title});
		var team1 = template.find('#team1 :selected').text
		var team2 = template.find('#team2 :selected').text

		var q = {
			que: team1 + " vs " + team2,
			gameName: title,
			options: {
				option1: {title: team1 + " by 1-13", number: 1,multiplier: 4},
				option2: {title: team2 + " by 1-13 ", number: 2, multiplier: 4},
				option3: {title: team1 + " by 14+", number: 3, multiplier: 4},
				option4: {title: team2 + " by 14+", number: 4, multiplier: 4}
			}
		}
		Meteor.call('gamePrediction', q);
	}
});
