Template.games.helpers({
	game: function () {
		return Games.find({'completed': false}, {sort: {"dateCreated": 1}}).fetch();
	}
});