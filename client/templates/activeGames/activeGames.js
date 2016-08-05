Template.activeGames.rendered = function() {
    console.log(this.data); // you should see your passage object in the console
};


Template.activeGames.helpers({
  games: function ( ) {
    return Games.find({}).fetch();
  },
  gameClass: function () {
    return "game-item-" + this['status'];
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
    Meteor.call('userJoinsAGame', Meteor.userId(), gameId)
    Router.go("game", {id: gameId});
  },
  'click [data-action=no-group]': function(){
    Router.go('/groups')
  }, 
});
