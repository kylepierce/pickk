Template._gameScoreModal.helpers({
	game: function () {
		var gameId = Router.current().params._id
		var game = Games.findOne({_id: gameId})
		return game.scoring
	},
	teamOne: function () {
		return this.away.name
	},
	teamOneScore: function () {
		return this.away.runs
	},
	teamTwo: function () {
		return this.home.name
	},
	teamTwoScore: function () {
		return this.home.runs
	}
});

Template._gameScoreModal.events({
	'click [data-action=submit]': function () {
		// ...
		var homeScore = $('#home')[0].value
		var awayScore = $('#away')[0].value
		homeScore = parseInt(homeScore)
		awayScore = parseInt(awayScore)
		var gameId = Router.current().params._id
		
		Meteor.call('updateGameScore', gameId, homeScore, awayScore)
	}
});