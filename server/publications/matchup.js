Meteor.publish('upcomingMatchups', function (selector){
  check(selector, Object);
  return Matchup.find(selector, {limit: 20});
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

Meteor.publish('matchupUsers', function(matchupId) {
  check(matchupId, String);

  var matchup = Matchup.findOne(matchupId);
  var selector = {_id: {$in: matchup.users}}
  var fields = {
    fields: {
      'profile.username': 1,
      'profile.avatar': 1,
      '_id': 1
    }
  }

  return UserList.find(selector, fields);
});
