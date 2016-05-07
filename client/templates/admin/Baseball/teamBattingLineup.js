Template.teamBattingLineup.helpers({
  teamName: function ( ) {
    var currentGame = Games.findOne({live: true})
    var topOfInning = currentGame.topOfInning

    // Depending on inning postion pick the visitor (0) or home team (1).
    if( topOfInning === true ){
        var team = currentGame.teams[0]
    } else {
        var team = currentGame.teams[1]
    }
    var teamId = team.teamId
    var team = Teams.findOne({"_id": teamId})
    return team.nickname
  },
  player: function () {
    var currentGame = Games.findOne({live: true})
    var topOfInning = currentGame.topOfInning

    // Depending on inning postion pick the visitor (0) or home team (1).
    if( topOfInning === true ){
        var team = currentGame.teams[0]
    } else {
        var team = currentGame.teams[1]
    }
    var teamId = team.teamId
    var playerList = Players.find({team: teamId}).fetch();
    return playerList
  },
  alreadyInLineUp: function (id) {
    var currentGame = Games.findOne({live: true})
    var topOfInning = currentGame.topOfInning

    // Depending on inning postion pick the visitor (0) or home team (1).
    if( topOfInning === true ){
        var team = currentGame.teams[0]
    } else {
        var team = currentGame.teams[1]
    }

    var playerExists = team.battingLineUp.indexOf(id)
    if(playerExists !== -1){
      return false
    } else {
      return true
    }
  },
  battingLineUp: function (  ){
    var currentGame = Games.findOne({live: true})
    var topOfInning = currentGame.topOfInning

    // Depending on inning postion pick the visitor (0) or home team (1).
    if( topOfInning === true ){
        var team = currentGame.teams[0]
    } else {
        var team = currentGame.teams[1]
    }

    var battingLineUp = team.battingLineUp
    return battingLineUp
  },
  onePlayer: function ( id ) {
    var player = Players.findOne({_id: id});
    return player
  }
});

Template.teamBattingLineup.events({
  'click [data-action=addToBattingOrder]' : function (event, template) {
    var currentGame = Games.findOne({live: true})
    var gameId = currentGame._id
    var playerId = this._id
    var teamId = this.team
    Meteor.call('addPlayerToLineup', gameId, teamId, playerId)
  },
  'click [data-action=removeFromBattingOrder]' : function (event, template) {
    var currentGame = Games.findOne({live: true})
    var gameId = currentGame._id
    var playerId = this._id
    var teamId = this.team
    Meteor.call('removePlayerFromLineup', gameId, teamId, playerId)
  },
})