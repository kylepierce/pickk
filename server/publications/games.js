// Upcoming Games

Meteor.publish('singleGame', function(_id) {
  check(_id, String);
  return Games.find({_id: _id}, 
    {fields: {
      live: 1, complete: 1, _id: 1, id: 1, status: 1, ball: 1, strike: 1,coverage: 1, game_number: 1, day_night: 1, scheduled: 1, home_team: 1, away_team: 1, venue: 1, broadcast: 1, home: 1, away: 1, name: 1, gameDate: 1, tv: 1, dateCreated: 1, live: 1, completed: 1, commercial: 1, scoring: 1, teams: 1, outs: 1, inning: 1, topOfInning: 1, playersOnBase: 1, users: 1, nonActive: 1, commercialStartedAt: 1, football: 1
    }});
});

// Only live games
Meteor.publish('activeGames', function(days, day) {
  check(days, Number);
  check(day, Number);
  
  var specificDay = moment().dayOfYear(day)

  var start = specificDay.startOf('day').add(4, "hour").toDate();
  var finish = specificDay.startOf('day').add(28, "hour").toDate(); // today and tomorrow
  console.log(finish)

  var selector = {scheduled: {$gt: start, $lt: finish}, type: {$ne: "predictions"}};

  var parms = {sort: {live: -1, scheduled: 1}, fields: {live: 1, complete: 1, name: 1, ball: 1, strike: 1, tv: 1, gameDate: 1, scheduled: 1, scoring: 1, status: 1, home: 1, away: 1, playersOnBase: 1, outs: 1, inning: 1, topOfInning: 1, users: 1, football: 1, close_processed: 1, type: 1}}

  return Games.find(selector, parms);

});

Meteor.publish('liveGames', function() {
  var selector = {live: true}
  var parms = {sort: {scheduled: 1}, fields: {live: 1, complete: 1, name: 1, ball: 1, strike: 1, tv: 1, gameDate: 1, scheduled: 1, scoring: 1, status: 1, home: 1, away: 1, playersOnBase: 1, outs: 1, inning: 1, topOfInning: 1, users: 1, football: 1}}
  return Games.find(selector, parms);
});

Meteor.publish('singleGameQuestions', function(gameId){
  check(gameId, String);
  var selector = {gameId: gameId}
  var sort = {sort: {dateCreated: -1}, limit: 50}
  return Questions.find(selector, sort);
});

// Meteor.publish('pendingQuestions', function(gameId) {
//   check(gameId, String);
//   var selector = {gameId: gameId, active: null}
//   var sort = {sort: {dateCreated: -1}}
//   return Questions.find(selector, sort);
// });

// Meteor.publish('oldQuestions', function(gameId) {
//   check(gameId, String);
//   var selector = {gameId: gameId, active: false}
//   var sort = {sort: {dateCreated: -1}, limit: 3}
//   return Questions.find(selector, sort);
// });

Meteor.publish('singleGameData', function(id) {
  check(id, String);
  return Games.find({_id: id}, {fields: {name: 1}});
});

Meteor.publish('singleQuestion', function(id) {
  check(id, String);
  return Questions.find({_id: id}, {fields: {_id: 1, que: 1, outcome: 1, options: 1}})
})
