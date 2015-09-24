Template.games.helpers({
	game: function () {
		Meteor.subscribe('games')
		return Games.find({'complete': false}, {sort: {"dateCreated": 1}}).fetch();
	}
});