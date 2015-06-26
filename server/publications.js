Meteor.publish('activeQuestions', function(){
	var currentUserId = this.userId;
	return QuestionList.find({ });
});


Meteor.publish('userNotAnswered', function(){
	var currentUserId = this.userId;
	return QuestionList.find({active: true, usersTrue: {$nin: [currentUser]}, 
		usersFalse: {$nin: [currentUser]}});
});

// Meteor.publish('userNotAnswered', function(){
// 	var currentUserId = this.userId;
// 	return QuestionList.find({active: true, usersAnswered: {$nin: [currentUserId]}});
// });


Meteor.publish('userAnswer', function(){
	var currentUserId = this.userId;
	return UserList.find({_id: currentUserId});
});

Meteor.publish('leaderboard', function() {
	return UserList.find( { });
})

Meteor.publish('profile', function() {
  return UserList.find();
});

Meteor.publish('profile', function(_id) {
  return UserList.find({_id: _id});
});