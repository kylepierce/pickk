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
  },

  next: function () {
    var day = parseInt(Router.current().params.day) + 1
    if (day) { 
      var now = moment().dayOfYear(day)
    } else {
      var day = moment().dayOfYear()
      var now = moment().dayOfYear(day + 1)
    }
    
    return moment(now,"MM/DD/YYYY", true).format("MMM Do");
  },

  prev: function () {
    var day = parseInt(Router.current().params.day) - 1
    if (day) { 
      var now = moment().dayOfYear(day) 
    } else {
      var day = moment().dayOfYear()
      var now = moment().dayOfYear(day - 1)
    }

    return moment(now,"MM/DD/YYYY", true).format("MMM Do");
  },

  admin: function () {
    var user = Meteor.user()
    if (user.profile.role === "admin"){
      return true
    }
  },
});

Template.games.events({
  'click [data-action=previous]': function (e, t){
    // Find the day from router or moment
    var day = Router.current().params.day
    if (day === null || day === undefined) { 
      var day = moment().dayOfYear()
    }
    //One less day
    var previousDay = parseInt(day) - 1
    Router.go("/games/" + previousDay)
  },

  'click [data-action=next]': function (e, t){
    // Find the day from router or moment
    var day = Router.current().params.day
    if (day === null || day === undefined) { 
      var day = moment().dayOfYear()
    }
    //One less day
    var nextDay = parseInt(day) + 1
    Router.go("/games/" + nextDay)
  },
  'click [data-action=gameOver]': function (e, t) {
    var gameId = $(e.currentTarget).attr("data-game-id");
    Meteor.call('endGame', gameId)
  },
  'click [data-action=gameAdmin]': function (e, t) {
    var gameId = $(e.currentTarget).attr("data-game-id");
    Router.go('/admin/game/' + gameId + "/1")
  }
});
