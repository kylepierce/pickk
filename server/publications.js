Meteor.publish('activeQuestions', function(){
	var currentUserId = this.userId;
	return QuestionList.find(
				{active: true, 
				usersAnswered: {$nin: [currentUserId]}}, 
				{sort: {dateCreated: 1,}});
});


Meteor.publish('userNotAnswered', function(){
	var currentUserId = this.userId;
	return QuestionList.find({active: true, usersAnswered: {$nin: [currentUserId]}});
});

Meteor.publish('questions', function(){
	return QuestionList.find({ });
});


Meteor.publish('userAnswer', function(){
	var currentUserId = this.userId;
	return UserList.find({_id: currentUserId});
});

Meteor.publish('leaderboard', function() {
	return UserList.find({ });
})

Meteor.publish('groups', function() {
  return Groups.find({ });
});

Meteor.publish('groupUsers', function(groupId) {
  check(groupId, String);
  var group = Groups.findOne(groupId);
  var selector = {_id: {$in: group.members}};
  // var options = {fields: {"profile.username": 1}, {"prof"}};
  return UserList.find(selector);
});

Meteor.publish('profile', function(_id) {
  return UserList.find({_id: _id});
});