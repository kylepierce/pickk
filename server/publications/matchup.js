Meteor.publish('upcomingMatchups', function (){
  return Matchup.find({});
});

Meteor.publish('singleMatchup', function(matchupId){
  return Matchup.find({_id: matchupId});
});

Meteor.publish('singleGameMatchups', function(gameId){
  check(gameId, String);
  var userId = this.userId;
  return Matchup.find({gameId: gameId, users: {$in: [userId]}})
});

Meteor.publish("singleGroupMatchups", function(groupId){
  check(groupId, String);
  return Matchup.find({groupId: groupId});
});
