Template.games.helpers({
  gameClass: function () {
    return "game-item-" + this['status'];
  },

  hasActiveGames: function () {
		return Template.instance().data.games.length > 0;
  },
  
  inprogress: function (status) {
    if (status == "inprogress"){
      return true
    }
  }
});

Template.games.events({
  "click .game": function (event, template) {
    var gameId = $(event.currentTarget).attr("data-game-id");
    Router.go("game", {id: gameId});
  }
});
