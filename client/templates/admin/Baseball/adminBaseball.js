Template.adminBaseball.events({
	'click [data-action=createBaseballQuestion]': function (event, template) {
		event.preventDefault();
		Meteor.call('createBaseballQuestion');
	}, 
	'click [data-action=createAtBat]': function (event, template) {
		event.preventDefault();
		var currentGame = Games.findOne({live: true});
	  var currentGameId = currentGame._id
	  console.log(currentGameId)
		Meteor.call('createAtBat', "playerId", currentGameId);
	},
	'click [data-action=createBaseballGame]': function (event, template) {
		event.preventDefault();
		Meteor.call('createBaseballGame', "team1", "team2", "dateOfGame", "timeOfGame", "tvStation");
	},
});

Template.adminBaseball.helpers ({
	atBat: function(){
		var atBat = AtBat.find({ }).fetch()
		return atBat
	}
})

Template.battingLineUp.helpers({
	batter: function () {
		// Find the current game and the team that is at bat.
		return Meteor.call("findBattingLineUp")
	},
	playersInfo: function ( playerId ) {
		var player = Players.findOne({_id: playerId})
		console.log(player)
		return player
	} 
});