Meteor.publish('weekLeaderboard', function(){
	var thisWeek = moment().week()
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

