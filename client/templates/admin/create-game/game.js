Template.gameInfo.events({
	'submit form': function (event, template) {
		// Get the value of the input box
		event.preventDefault();
		var team1 = template.find('#team1 :selected').text
		var team2 = template.find('#team2 :selected').text
		var active = template.find('#gameActive').checked
		var title = team1 + " vs " + team2
		var tv = template.find('#tv').value
		var gameTime = template.find('#gameTime').value
		var timeOfGame = "now"
		Meteor.call('createGame', team1, team2, title, active, tv, gameTime);
	}
}); 

Template.gameInfo.helpers({
	game: function () {
		return Games.find({}, {sort: {"dateCreated": -1}}).fetch();
	}
});