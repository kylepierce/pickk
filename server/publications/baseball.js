// At Bat 
Meteor.publish('activeAtBat', function(gameId) {
  check(gameId, String);
  
  return AtBat.find({gameId: gameId, active: true});
});

Meteor.publish('activePlayers', function(gameId) {
  check(gameId, String);
  
  // Fix Next
  // var fields = {
  //   name: 
  // }
  var teams = Meteor.call('playersPlaying', gameId);
  return Players.find({_id: {$in: teams}})
});


Meteor.publish('atBatPlayer', function(gameId) {
  check(gameId, String);

  var atBat = AtBat.findOne({gameId: gameId, active: true});
  if (atBat) {
    var playerId = atBat.playerId
    return Players.find({_id: playerId});
  } else {
    return this.ready();
  }
});