Meteor.publish('activeQuestions', function(){
	var currentUserId = this.userId
	return QuestionList.find({ });
});
Meteor.publish('userAnswer', function(){
	var currentUserId = this.userId
	return UserList.find({_id: currentUserId});
});