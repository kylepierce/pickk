Template.activeGames.helpers({
  gameClass: function () {
    return "game-item-" + this['status'];
  },

  hasActiveGames: function () {
		return Template.instance().data.games.length > 0;
  }
});

Template.activeGames.events({
  "click .game-item-inprogress": function (event, template) {
    var gameId = $(event.currentTarget).children('.game-item-outer').attr("data-game-id");
    Router.go("game", {id: gameId});
  }
});
