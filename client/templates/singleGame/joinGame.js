Template.joinGame.onCreated(function() {

});

Template.joinGame.rendered = function () {

};

Template.joinGame.helpers({
  gameAbbr: function(){
    var game = Games.findOne();
    var team1 = game.home.abbreviation.toUpperCase()
    var team2 = game.away.abbreviation.toUpperCase()
    var output = team1 + " vs " + team2
    return output
  },
  notAlreadyJoined: function (){
    var $gameId = Router.current().params._id
    var userId = Meteor.userId();
    var game = Games.findOne();
    var period = game.period

    Meteor.subscribe('joinGameCount', game._id, userId, period)
    var count = Counts.get('joinGameCount');
    if (count === 1){
      Router.go('game.show', {_id: $gameId});
    } else {
      return true
    }
  }
});

Template.joinGame.events({

});
