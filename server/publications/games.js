// Upcoming Games
Meteor.publish('singleGame', function(_id) {
  check(_id, String);
  return Games.find({_id: _id}, {fields: {inning: 0}});
});

// Only live games
Meteor.publish('activeGames', function(length, sports) {
  check(length, String);
  check(sports, Array);
  this.unblock()

  var specificDay = moment()
  var start = specificDay.startOf('day').toDate();
  if(length === "Day"){
    var finish = specificDay.endOf('day').add(4, "hour").toDate();
  } else if (length === "Month") {
    var finish = specificDay.endOf('month').add(28, "hour").toDate();
  } else {
    var finish = specificDay.endOf('week').add(28, "hour").toDate();
  }

  var selector = {scheduled: {$gt: start, $lt: finish}, type: {$ne: "prediction"}, sport: {$in: sports}};
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
