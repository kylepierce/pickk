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

Meteor.publish('leaderboardGamePlayed', function(gameId, period, number) {
  check(gameId, String);
  check(period, Number);
  check(number, Number);
  this.unblock()

  var fields = {fields: {userId: 1, gameId: 1, coins: 1, period: 1}}
  if( period === 0) {
		var game = Games.find({_id: gameId }).fetch()
	  var period = game[0].period
		var selector = {gameId: gameId, period: period}
	} else if (period === -1){
    var selector = {gameId: gameId}
  } else {
    var selector = {gameId: gameId, period: period}
  }

  if (number === -1){
    var sort = {sort: {coins: -1}}
    var selector = {gameId: gameId}
  } else {
    var sort = {sort: {coins: -1}, limit: number}
  }
  var gamesPlayed = GamePlayed.find(selector, fields, sort)
  return gamesPlayed
});
