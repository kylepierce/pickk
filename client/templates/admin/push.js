Template.push.helpers({
	game: function(){
		Meteor.subscribe('games');
		return Games.find({live: true}).fetch();
	}
});


Template.push.events({
	'submit form': function (event, template) {
		// Get the value of the input box
		event.preventDefault();
		var message = template.find('input[name=push]').value
		Meteor.call("push", message)
	}
});