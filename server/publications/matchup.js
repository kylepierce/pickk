Meteor.publish('upcomingMatchups', function (selector){
  check(selector, Object);
  if(selector.size){
    selector.size = parseInt(selector.size);
  }
  if (selector.featured){
    var featured = selector.featured
    if(featured === true){
      selector.featured = true
    } else if (featured === "false"){
      selector.featured = false
    } else {
      selector.featured = [false, true]
    }
  }
  if (selector.secret){
    var secret = selector.secret.toLowerCase();
    selector.secret = secret
  }
  return Matchup.find(selector, {limit: 20});
});

Meteor.publish('singleMatchup', function(matchupId){
  return Matchup.find({_id: matchupId});
});

Meteor.publish('listOfMatchups', function(selector){
  this.unblock();
  check(selector, Object);
  return Matchup.find(selector)
});

// Meteor.publish("singleLeagueMatchupCount", function(leagueId){
//   check(leagueId, String);
//   var selector = { leagueId: leagueId};
//   var matchups = Matchup.find(selector).count()
//   // console.log(leagueId, matchups)
//   return matchups
//   Counts.publish(this, "singleLeagueMatchupCount", Matchup.find(selector));
// });

Meteor.publish("singleLeagueMatchups", function (leagueId) {
  check(leagueId, String);
  var selector = { leagueId: leagueId };
  return Matchup.find(selector);
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

Meteor.publish('usersMatchups', function(userId){
  check(userId, String);

  return Matchup.find({users: {$in: [userId]}})
});