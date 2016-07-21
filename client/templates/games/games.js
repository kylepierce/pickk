Template.games.helpers({
	gameClass: function () {
		return "game-item-" + this['status'];
	},
	
	game: function () {
		return Games.find({}, {sort: {"scheduled": 1}}).fetch();
	}
});

Template.games.events({
	"click .game-item-inprogress": function (event, template) {
		var gameId = $(event.currentTarget).children('.game-item-outer').attr("data-game-id");
		Router.go("game", {id: gameId});
	}
});
