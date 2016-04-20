Template.teamBattingLineup.helpers({
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

  var teamObj = Teams.findOne({_id: teamId});
  return teamObj.battingOrderLineUp
	}
});