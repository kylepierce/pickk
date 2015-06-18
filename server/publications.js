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

Meteor.publish('userAnswer', function(){
	var currentUserId = this.userId;
	return UserList.find({_id: currentUserId});
});

Meteor.publish('leaderboard', function() {
	return UserList.find( { });
})
