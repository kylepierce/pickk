Meteor.publish('activeQuestions', function(){
	var currentUserId = this.userId;
	return QuestionList.find(
				{active: true, 
				usersAnswered: {$nin: [currentUserId]}}, 
				{sort: {dateCreated: 1,}});
});


Meteor.publish('userNotAnswered', function(){
	var currentUserId = this.userId;
		return QuestionList.find({active: true}, {sort: {dateCreated: 1}});
});

Meteor.publish('questions', function(){
	var activeQuestions = QuestionList.find({active: true}, {sort: {dateCreated: 1}});
	if(activeQuestions){
		return activeQuestions
	}
	return this.ready();
});

// Meteor.publish('activeQuestions', function(){
// 	var activeQuestions = QuestionList.find({active: true}, {sort: {dateCreated: 1}});
// 	if(activeQuestions){
// 		return activeQuestions
// 	}
// 	return this.ready();
// });

Meteor.publish('pendingQuestions', function(){
	var pendingQuestions = QuestionList.find({active: null}, {sort: {dateCreated: 1}});
	if(pendingQuestions){
		return pendingQuestions
	}
	return this.ready();
});

Meteor.publish('oldQuestions', function(){
	var oldQuestions = QuestionList.find({active: false}, {sort: {dateCreated: -1}, limit: 3});
	if(oldQuestions){
		return oldQuestions
	}
	return this.ready();
})

Meteor.publish('allQuestions', function(game){
	var allQuestions = QuestionList.find({gameId: game});
	if(allQuestions){
		return allQuestions
	}
	return this.ready();
})

Meteor.publish('invitees', function(){
	return Invites.find({ });
});


Meteor.publish('userAnswer', function(){
	var currentUserId = this.userId;
	return UserList.find({_id: currentUserId});
});

// Meteor.publish('leaderboard', function() {
// 	return UserList.find({ });
// })

Meteor.publish('worldLeaderboard', function() {
	return UserList.find({});
})

// Meteor.publish('groupLeaderboard', function(groupId) {
// 	return 
// })

Meteor.publish('groups', function() {
  return Groups.find({ });
});

Meteor.publish('games', function() {
  return Games.find({ });
});

Meteor.publish('groupUsers', function(groupId) {
  check(groupId, String);
  var group = Groups.findOne(groupId);
  var selector = {_id: {$in: group.members}};
  // var options = {fields: {"profile.username": 1}, {"prof"}};
  return UserList.find(selector);
});

Meteor.publish('profile', function(user) {
  return UserList.find({_id: user});
});