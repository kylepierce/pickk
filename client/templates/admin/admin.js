// map multiple combinations to the same callback
Mousetrap.bind('d', function() {
	$('[data-action=deactivate]').click()
	return false;
}, 'keyup');

// Create question and add to database function
Template.otherQuestions.events({
	'click [data-action="startCommercialBreak"]': function(event, template){
		// Turn off reload
		event.preventDefault();
		var gameId = Router.current().params._id
		Meteor.call('toggleCommercial', gameId, true);
	},

	'click [data-action="endCommercialBreak"]': function(event, template){
		// Turn off reload
		event.preventDefault();
		var gameId = Router.current().params._id
		Meteor.call('toggleCommercial', gameId, false);
	},

	'click [data-action="createCommericalQuestion"]': function(event, template){
		// Turn off reload
		event.preventDefault();
		Meteor.call('createCommericalQuestion')
	},

	'click [data-action="situationalQuestion"]': function(event, template){
		var que = prompt('Question you would like to ask')
		var gameId = Router.current().params._id
		Meteor.call('createTrueFalse', que, gameId)
	},
});




