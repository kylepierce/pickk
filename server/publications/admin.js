Meteor.publish('activeHero', function() {
	this.unblock()
  return Hero.find({active: true})
});

// Meteor.publish('multiplier', function(){
// 	return Multipliers.find({})
// });

Meteor.publish('situationalQuestions', function(){
	return Admin.find({situational: true});
});

Meteor.publish('singleGameFutureQuestions', function(gameId){
  check(gameId, String);
  var selector = {gameId: gameId, active: "future"}
  var sort = {sort: {dateCreated: -1}}
  return Questions.find(selector, sort);
});

Meteor.publish('singleGameActiveQuestions', function(gameId){
  check(gameId, String);
  var selector = {gameId: gameId, active: true}
  var sort = {sort: {dateCreated: -1}}
  return Questions.find(selector, sort);
});

Meteor.publish('singleGamePendingQuestions', function(gameId) {
  check(gameId, String);
  var selector = {gameId: gameId, active: null}
  var sort = {sort: {dateCreated: -1}}
  return Questions.find(selector, sort);
});

Meteor.publish('singleGameOldQuestions', function(gameId) {
  check(gameId, String);
  var selector = {gameId: gameId, active: false}
  var sort = {sort: {lastUpdated: -1}, limit: 5}
  return Questions.find(selector, sort);
});
