Template.matchup.onCreated(function() {

});

Template.matchup.helpers({
  'matchups': function(){
    return Matchup.find({});
  }
});

Template.matchup.events({
  'click .item': function(e,t){
    Router.go('/matchup/'+ this.m._id)
  }
});

Template.matchupItem.helpers({
  'username': function(ref) {
		Meteor.subscribe('findSingle', ref);
		return UserList.findOne({_id: ref}).profile.username
	},
  'gameName': function(gameId){
    Meteor.subscribe('singleGameData', gameId);
    var game = Games.findOne({_id: gameId})
    if (game){
      return game.name
    }
  },
  'users': function (userArray){
    return userArray.length
  },
  'limitNum': function(number){
    if(number === -1){
      return "∞"
    } else {
      return number
    }
  }
});

Template.matchupItem.events({

});
