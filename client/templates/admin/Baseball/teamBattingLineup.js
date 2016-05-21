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
    var team = Teams.findOne({_id: teamId})
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
    var playerList = Players.find({team: teamId}, {sort: {"stats.career.ab": 1}}).fetch();
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
  },
  atBat: function ( id ) {
    return AtBat.findOne({playerId: id, active: true})
  },
  'atBatNumber': function (  ){
    var currentGame = Games.findOne({live: true})
    var topOfInning = currentGame.topOfInning

    // Depending on inning postion pick the visitor (0) or home team (1).
    if( topOfInning === true ){
      var team = currentGame.teams[0]
    } else {
      var team = currentGame.teams[1]
    }
    return team
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
  'click [data-action=move-up]' : function (event, template) {
    var currentGame = Games.findOne({live: true})
    var topOfInning = currentGame.topOfInning

    // Depending on inning postion pick the visitor (0) or home team (1).
    if( topOfInning === true ){
        var team = currentGame.teams[0]
    } else {
        var team = currentGame.teams[1]
    }
    var playerId = this._id
    var playerExists = team.battingLineUp.indexOf(playerId)
    var gameId = currentGame._id
    var teamId = this.team
    Meteor.call('changeBattingPostion', gameId, teamId, playerId, playerExists, -1)
  },
  'click [data-action=move-down]' : function (event, template) {
    var currentGame = Games.findOne({live: true})
    var topOfInning = currentGame.topOfInning

    // Depending on inning postion pick the visitor (0) or home team (1).
    if( topOfInning === true ){
        var team = currentGame.teams[0]
    } else {
        var team = currentGame.teams[1]
    }
    var playerId = this._id
    var playerExists = team.battingLineUp.indexOf(playerId)
    var gameId = currentGame._id
    var teamId = this.team
    Meteor.call('changeBattingPostion', gameId, teamId, playerId, playerExists, +1)
  },
  'click [data-action=pick-position]' : function (event, template) {
    var currentGame = Games.findOne({live: true})
    var topOfInning = currentGame.topOfInning

    // Depending on inning postion pick the visitor (0) or home team (1).
    if( topOfInning === true ){
        var team = currentGame.teams[0]
    } else {
        var team = currentGame.teams[1]
    }
    var playerId = this._id
    var playerExists = team.battingLineUp.indexOf(playerId)
    var gameId = currentGame._id
    var teamId = this.team
    var numberOfBatters = team.battingLineUp.length
    var position = prompt("Position", 1);
    // Add data validation make sure the number is crazy large or negative
    if (position ) {
        console.log(position)
        Meteor.call('changeBattingPostion', gameId, teamId, playerId, playerExists, position)
    }  
  },
  'submit #atBat': function (event, template) {
    event.preventDefault()
    var batterNumber = template.find('.at-bat-number').value
    var currentGame = Games.findOne({live: true})
    var topOfInning = currentGame.topOfInning

    // Depending on inning postion pick the visitor (0) or home team (1).
    if( topOfInning === true ){
      var team = 0
    } else {
      var team = 1
    }
    var teamId = currentGame.teams[team].teamId
    var numberOfBatters = currentGame.teams[team].battingLineUp.length
    var numberOfBatters = numberOfBatters - 1    

    if( batterNumber > numberOfBatters) {
      alert("No players at that at bat");
    } else {
      Meteor.call('changeBatterNumber', teamId, batterNumber)
    }
  }
})