Template.adminBaseball.events({
	'click [data-action=createBaseballQuestion]': function (event, template) {
		event.preventDefault();
		Meteor.call('createBaseballQuestion', "atBatId", 2, 3, false);
	}, 
	'click [data-action=createAtBat]': function (event, template) {
		event.preventDefault();
		Meteor.call('createAtBat', "playerId", "A6PiQFJR7PLgZNjGv");
	},
	'click [data-action=createBaseballGame]': function (event, template) {
		event.preventDefault();
		Meteor.call('createBaseballGame', "team1", "team2", "dateOfGame", "timeOfGame", "tvStation");
	},
});

Template.adminBaseball.helpers ({
	atBat: function(){
		var atBat = AtBat.find({ }).fetch()
		console.log(atBat)
		return atBat
	}

})