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
    var day = Router.current().params.day

    if (day) { var now = moment().dayOfYear(day) }

    return moment(now,"MM/DD/YYYY", true).format("MMM Do YYYY");
  }
});

Template.games.events({
  "click .game": function (e, t) {
    var gameId = $(e.currentTarget).attr("data-game-id");
    Meteor.call('userJoinsAGame', Meteor.userId(), gameId)
    Router.go("game", {id: gameId});
  },

  'click [data-action=previous]': function (e, t){
    // Find the day from router or moment
    var day = Router.current().params.day
    if (day === null || day === NaN) { 
      var day = moment().dayOfYear()
    }
    //One less day
    var previousDay = parseInt(day) - 1
    Router.go("/games/" + previousDay)
  },

  'click [data-action=next]': function (e, t){
    // Find the day from router or moment
    var day = Router.current().params.day
    if (day === null || day === NaN) { 
      var day = moment().dayOfYear()
    }
    //One less day
    var nextDay = parseInt(day) + 1
    Router.go("/games/" + nextDay)
  }
});
