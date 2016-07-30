Template.activeGames.helpers({
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
  notBeta: function () {
    var betaUser = Meteor.user().profile.role
    if(betaUser === "beta" || betaUser === "admin"){
      return false
    }
  },
  userGroups: function() {
    var currentUser = Meteor.userId();
    return Groups.find({members: currentUser}).fetch()
  },

  groups: function(){
    var currentUser = Meteor.user();
    var groupCount = currentUser.profile.groups.length 
    if (groupCount){
      return true
    }
  },
});

Template.activeGames.events({
  "click .game": function (event, template) {
    var gameId = $(event.currentTarget).attr("data-game-id");
    Router.go("game", {id: gameId});
  },
  'click [data-action=no-group]': function(){
    Router.go('/groups')
  }, 
});
