Template.playerCard.helpers({
  playerInfo: function () {
    var playerAtBat = AtBat.findOne({active: true})
    var playerId = playerAtBat.playerId
    var player = Players.findOne({_id: playerId})
    return player
  }
});