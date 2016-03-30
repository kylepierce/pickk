Template.adminBaseball.events({
	'click [data-action=createBaseballQuestion]': function (event, template) {
		event.preventDefault();
		Meteor.call('createBaseballQuestion', "atBatId", 2, 3, false);
	}, 
	'click [data-action=createAtBat]': function (event, template) {
		event.preventDefault();
		Meteor.call('createAtBat', "playerId", "A6PiQFJR7PLgZNjGv");
	},
});

Template.adminBaseball.helpers ({
	atBat: function(){
		return AtBat.find({}).fetch()
	}

})