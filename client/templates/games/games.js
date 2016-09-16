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
  },

  date: function () {
    var now = moment();
    var today = moment(now,"MM/DD/YYYY", true).format("MMM Do YYYY");
    return today
  }
});

Template.games.events({
  "click .game": function (event, template) {
    var gameId = $(event.currentTarget).attr("data-game-id");
    Meteor.call('userJoinsAGame', Meteor.userId(), gameId)
    Router.go("game", {id: gameId});
  }
});
