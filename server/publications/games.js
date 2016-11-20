// Upcoming Games
Meteor.publish('singleGame', function(_id) {
  check(_id, String);
  return Games.find({_id: _id}, {fields: {inning: 0}});
});

// Only live games
Meteor.publish('activeGames', function(day) {
  check(day, Number);
  this.unblock()

  var specificDay = moment().dayOfYear(day)
  var start = specificDay.startOf('day').add(4, "hour").toDate();
  var finish = specificDay.endOf('day').add(28, "hour").toDate(); // today and tomorrow
  var selector = {scheduled: {$gt: start, $lt: finish}, type: {$ne: "predictions"}};
  var parms = {
    sort: {live: -1, scheduled: 1}, fields: {inning: 0}
  }

  return Games.find(selector, parms);
});

Meteor.publish('liveGames', function() {
  this.unblock()

  var selector = {status: "inprogress"};
  var parms = {
    sort: {live: -1, scheduled: 1},
    fields: {live: 1, complete: 1, name: 1, ball: 1, strike: 1, tv: 1, gameDate: 1, scheduled: 1, dateCreated: 1, scoring: 1, status: 1, home: 1, away: 1, playersOnBase: 1, outs: 1, inning: 1, topOfInning: 1, users: 1, football: 1, close_processed: 1, type: 1}
  }

  return Games.find(selector, parms);
});

Meteor.publish('singleGameData', function(id) {
  check(id, String);
  this.unblock()
  return Games.find({_id: id}, {fields: {name: 1}});
});

Meteor.publish('singleQuestion', function(id) {
  check(id, String);
  this.unblock()
  return Questions.find({_id: id}, {fields: {_id: 1, que: 1, outcome: 1, options: 1}})
})
