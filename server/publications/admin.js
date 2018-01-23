Meteor.publish('activeHero', function() {
	this.unblock()
  return Hero.find({active: true})
});

Meteor.publish('multiplier', function(){
	return Multipliers.find({})
});

Meteor.publish('allPrizes', function () {
  this.unblock();
  return Prizes.find();
});

Meteor.publish('prizes', function () {
  this.unblock();
  return Prizes.find({active: true});
});

Meteor.publish('winningsByUser', function(userId){
  this.unblock();
  return Winnings.find({userId: userId}, {sort: {gameId: -1}})
});

Meteor.publish('winners', function (selector) {
  this.unblock();
  // return Winnings.find({ paid: false });
  ReactiveAggregate(this, Winnings, [
    { $match: selector },
    {
      $group: {
        '_id': '$userId',
        'winnings': {
          $sum: '$winnings'
        },
      }
    },
    { $sort: { winnings: -1 } },
    {
      $project: {
        userId: '$userId',
        winnings: '$winnings',
      }
    }], { clientCollection: "winnings" });
  var userIds = Winnings.find(selector, {fields: {userId: 1}}).fetch()
  var userIds = _.uniq(_.map(userIds, function(user){
    return user.userId
  }));
  return UserList.find({_id: {$in: userIds}})
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
