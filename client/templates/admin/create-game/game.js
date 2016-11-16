Template.gameInfo.events({
	'submit form': function (e, t) {
		// Get the value of the input box
		e.preventDefault();
		var away = t.find('#away :selected').text
		var home = t.find('#home :selected').text
		var active = t.find('#gameActive').checked
		var channel = t.find('#tv').value
		var game = {
			away: away,
			home: home,
			active: active,
			channel: channel
		}

		Meteor.call('createGame', game);
		sAlert.success("Game Created!!" , {effect: 'slide', position: 'bottom', html: true});
	}
}); 

Template.gameInfo.helpers({
	game: function () {
		return Games.find({}, {sort: {"dateCreated": -1}}).fetch();
	}
});