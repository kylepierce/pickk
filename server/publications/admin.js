Meteor.publish('activeHero', function() {
	this.unblock()
  return Hero.find({active: true})
});

Meteor.publish('multiplier', function(){
	return Multipliers.find({})
});

Meteor.publish('prizes', function () {
  this.unblock();
  return Prizes.find({active: true});
});

Meteor.publish('situationalQuestions', function(){
	return Admin.find({situational: true});
});

Meteor.publish('singleGameFutureQuestions', function(gameId, period){
  check(gameId, String);
  var selector = {gameId: gameId, active: "future", period: period}
  var sort = {sort: {dateCreated: -1}}
  return Questions.find(selector, sort);
});

Meteor.publish('singleGameActiveQuestions', function(gameId, period){
  check(gameId, String);
  var selector = {gameId: gameId, active: true, period: period}
  var sort = {sort: {dateCreated: -1}}
  return Questions.find(selector, sort);
});

Meteor.publish('singleGamePendingQuestions', function(gameId, period) {
  check(gameId, String);
  var selector = {gameId: gameId, active: null, period: period}
  var sort = {sort: {dateCreated: -1}}
  return Questions.find(selector, sort);
});

Meteor.publish('singleGameOldQuestions', function(gameId, period) {
  check(gameId, String);
  var selector = {gameId: gameId, active: false, period: period}
  var sort = {sort: {lastUpdated: -1}, limit: 5}
  return Questions.find(selector, sort);
});
