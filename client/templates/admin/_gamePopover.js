Template._gamePopover.helpers({
	game: function () {
		var gameId = Session.get('gamePrediction');
		return Questions.findOne({_id: gameId})
	}
});

Template._gamePopover.events({
	'click [data-action=option1]': function() {
		var gameId = Session.get('gamePrediction');
		Meteor.call('modifyGameQuestionStatus', gameId, "option1")
		IonPopover.hide();
	},
		'click [data-action=option2]': function() {
		var gameId = Session.get('gamePrediction');
		Meteor.call('modifyGameQuestionStatus', gameId, "option2")
		IonPopover.hide();
	},
		'click [data-action=option3]': function() {
		var gameId = Session.get('gamePrediction');
		Meteor.call('modifyGameQuestionStatus', gameId, "option3")
		IonPopover.hide();
	},
		'click [data-action=option4]': function() {
		var gameId = Session.get('gamePrediction');
		Meteor.call('modifyGameQuestionStatus', gameId, "option4")
		IonPopover.hide();
	},
		'click [data-action=option5]': function() {
		var gameId = Session.get('gamePrediction');
		Meteor.call('modifyGameQuestionStatus', gameId, "option5")
		IonPopover.hide();
	},
	'click [data-action=option6]': function() {
		var gameId = Session.get('gamePrediction');
		Meteor.call('modifyGameQuestionStatus', gameId, "option6")
		IonPopover.hide();
	}, 
})
