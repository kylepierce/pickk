// Upcoming Games

Meteor.publish('singleGame', function(_id) {
  check(_id, String);
  return Games.find({_id: _id}, 
    {fields: {
      live: 1, complete: 1, _id: 1, id: 1, status: 1, ball: 1, strike: 1,coverage: 1, game_number: 1, day_night: 1, scheduled: 1, home_team: 1, away_team: 1, venue: 1, broadcast: 1, home: 1, away: 1, name: 1, gameDate: 1, tv: 1, dateCreated: 1, live: 1, completed: 1, commercial: 1, scoring: 1, teams: 1, outs: 1, inning: 1, topOfInning: 1, playersOnBase: 1, users: 1, nonActive: 1, commercialStartedAt: 1, football: 1
    }});
});

// Only live games
Meteor.publish('activeGames', function(days) {
  check(days, Number);
  
  const today = moment().startOf('day').toDate();
  const tomorrow = moment().startOf('day').add(days, "days").toDate(); // today and tomorrow

  var selector = {$or: [{live: true}, {scheduled: {$gt: today, $lt: tomorrow}}]};
  var parms = {sort: {scheduled: 1}, fields: {live: 1, complete: 1, name: 1, ball: 1, strike: 1, tv: 1, gameDate: 1, scheduled: 1, scoring: 1, status: 1, home: 1, away: 1, playersOnBase: 1, outs: 1, inning: 1, topOfInning: 1, users: 1, football: 1}}
  
  // var tester = isTester();
  // if ( ! tester) {
  //   selector.public = true;
  // }

  return Games.find(selector, parms);
});

Meteor.publish('pendingQuestions', function(gameId) {
  check(gameId, String);
  var selector = {gameId: gameId, active: null}
  var sort = {sort: {dateCreated: -1}}
  return Questions.find(selector, sort);
});

Meteor.publish('singleGameData', function(id) {
  check(id, String);
  return Games.find({_id: id}, {fields: {name: 1}});
});

Meteor.publish('singleQuestion', function(id) {
  check(id, String);
  return Questions.find({_id: id})
})
