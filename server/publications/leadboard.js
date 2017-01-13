Meteor.publish('weekLeaderboard', function(thisWeek){
	check(thisWeek, Number);
	this.unblock()
	// var thisWeek = moment().week()
  var day = moment().day()
  if (day < 2){
    var thisWeek = thisWeek - 1
  }
	var users = Meteor.call('loadWeekLeaderboard', thisWeek);

	var newArray = []
	users.forEach(function (post) {
		newArray.push(post.user)
	});

	return UserList.find({_id: {$in: newArray}}, {fields: {_id: 1, avatar: 1, services: 1, 'profile.username': 1}})
});

Meteor.publish('singleGamePlayedIn', function (game, userId){
  check(game, String);
  check(userId, String);
  var selector = {gameId: game, userId: userId}
  return GamePlayed.find(selector);
});

Meteor.publish('leaderboardGamePlayed', function(o) {
  check(o, Object);
  this.unblock()
	var selector = {gameId: o.gameId}
	var sort = {sort: {coins: -1}, limit: 5}
  var fields = {fields: {userId: 1, gameId: 1, coins: 1, period: 1, queCounter: 1, type: 1, diamonds: 1}}

  if (o.period) { selector.period = parseInt(o.period) }
  if (o.number) { sort.limit = parseInt(o.number) }
	
  var gamesPlayed = GamePlayed.find(selector, fields, sort)
  return gamesPlayed
});
