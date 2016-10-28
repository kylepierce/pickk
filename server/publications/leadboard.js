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

Meteor.publish('leaderboardGamePlayed', function(game, number) {
  check(game, String);
  this.unblock()
  
  var selector = {gameId: game}
  var fields = {fields: {userId: 1, gameId: 1, coins: 1}}
  
  if (number === -1){
    var sort = {sort: {dateCreated: -1}}
  } else {
    var sort = {sort: {dateCreated: -1}, limit: number}
  }
  
  return GamePlayed.find(selector, fields, sort)
});