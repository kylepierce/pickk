Template.gameInfo.events({
	'submit form': function (event, template) {
		// Get the value of the input box
		event.preventDefault();
		var team1 = template.find('#team1 :selected').text
		var team2 = template.find('#team2 :selected').text
		var active = template.find('#gameActive').checked
		var title = template.find('#title').value
		Meteor.call('createGame', team1, team2, title, active);
	}
}); 

Template.gameInfo.helpers({
	game: function () {
		Meteor.subscribe('games')
		return Games.find({}, {sort: {"dateCreated": -1}}).fetch();
	}
});