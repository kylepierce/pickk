Meteor.publish('activeQuestions', function(){
	var currentUserId = this.userId;
	return QuestionList.find({ });
});

Meteor.publish('userNotAnswered', function(){
	var currentUserId = this.userId;
	return QuestionList.find({active: true, usersTrue: {$nin: [currentUser]}, 
		usersFalse: {$nin: [currentUser]}});
});

Meteor.publish('userAnswer', function(){
	var currentUserId = this.userId;
	return UserList.find({_id: currentUserId});
});

Meteor.publish('leaderboard', function() {
	return UserList.find( { });
})