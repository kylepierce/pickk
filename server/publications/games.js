// Upcoming Games
Meteor.publish('singleGame', function(_id) {
  check(_id, String);
  return Games.find({_id: _id}, {fields: {inning: 0, pbp: 0}});
});
// Only live games
Meteor.publish('activeGames', function(length, sports) {
  check(length, String);
  check(sports, Array);
  this.unblock()
  var length = length.toLowerCase()
  var specificDay = moment()
  var start = specificDay.startOf('day').add(4, "hour").toDate();
  if(length === "day"){
    var finish = specificDay.endOf('day').add(4, "hour").toDate();
  } else if (length === "month") {
    var finish = specificDay.endOf('day').add(30, "days").toDate();
  } else if (length === "last-month") {
    var finish = specificDay.startOf('day').toDate();
    var start = specificDay.endOf('day').subtract(60, "days").toDate();
  } else if (length === "last-week") {
    var finish = specificDay.startOf('day').toDate();
    var start = specificDay.subtract(7, "days").toDate();
  } else {
    var finish = specificDay.endOf('day').add(7, "days").toDate();
  }

  // I was using football for a long time instead of NFL this is fix
  if (sports.indexOf("NFL") >= 0){
    sports.push("football")
  }

  var selector = {scheduled: {$gt: start, $lt: finish}, type: {$ne: "prediction"}, sport: {$in: sports}};
  //
  var parms = {
    sort: {live: -1, scheduled: 1}, fields: {inning: 0, pbp: 0}
  }
  var games = Games.find(selector, parms);
  return games
});

Meteor.publish('liveGames', function() {
  this.unblock()

  var selector = {status: {$in: ["inprogress", "In-Progress"]}, type: {$ne: "prediction"}};
  var parms = {
    sort: {live: -1, scheduled: 1},
    fields: {inning: 0, pbp: 0}
  }

  return Games.find(selector, parms);
});

Meteor.publish('upcomingGames', function() {
  this.unblock()
  var specificDay = moment()
  var start = specificDay.startOf('day').add(4, "hour").toDate();
  var selector = {scheduled: {$gt: start}, status: "Pre-Game", type: {$ne: "prediction"}};
  var parms = {
    sort: {scheduled: 1},
    limit: 3,
    fields: {inning: 0, pbp: 0}
  }

  return Games.find(selector, parms);
});

Meteor.publish('singleGameData', function(id) {
  check(id, String);
  this.unblock()
  return Games.find({_id: id}, {fields: {name: 1, scheduled: 1}});
});

Meteor.publish('singleQuestion', function(id) {
  check(id, String);
  this.unblock()
  return Questions.find({_id: id}, {fields: {_id: 1, que: 1, outcome: 1, options: 1}})
})

Meteor.publish('joinGameCount', function(gameId, userId, period){
  check(gameId, String);
  check(userId, String);
  check(period, Number);
  this.unblock();
  Counts.publish(this, "joinGameCount", GamePlayed.find({gameId: gameId, userId: userId, period: period}));

});
