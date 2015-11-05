Template.games.helpers({
	game: function () {
		return Games.find({'complete': false}, {sort: {"dateCreated": 1}}).fetch();
	}
});