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
  var finish = specificDay.endOf('day').add(4, "hour").toDate(); // today and tomorrow
  var selector = {scheduled: {$gt: start, $lt: finish}, type: {$ne: "prediction"}};
  var parms = {
    sort: {live: -1, scheduled: 1}, fields: {inning: 0}
  }

  var games = Games.find(selector, parms);
  return games
});

Meteor.publish('liveGames', function() {
  this.unblock()

  var selector = {status: "inprogress", type: {$ne: "prediction"}};
  var parms = {
    sort: {live: -1, scheduled: 1},
    fields: {inning: 0}
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

Meteor.publish('joinGameCount', function(data){
  check(data, Object);
  this.unblock();
  Counts.publish(this, "joinGameCount", GamePlayed.find(data));
});
