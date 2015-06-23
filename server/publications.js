Meteor.publish('activeQuestions', function(){
	var currentUserId = this.userId;
	return QuestionList.find({ });
});

<<<<<<< HEAD
Meteor.publish('userNotAnswered', function(){
	var currentUserId = this.userId;
	return QuestionList.find({active: true, usersTrue: {$nin: [currentUser]}, 
		usersFalse: {$nin: [currentUser]}});
});
=======
// Meteor.publish('userNotAnswered', function(){
// 	var currentUserId = this.userId;
// 	return QuestionList.find({active: true, usersAnswered: {$nin: [currentUserId]}});
// });
>>>>>>> parent of f621e3c... trying to fix collection bug

Meteor.publish('userAnswer', function(){
	var currentUserId = this.userId;
	return UserList.find({_id: currentUserId});
});

Meteor.publish('leaderboard', function() {
	return UserList.find( { });
})

Meteor.publish("userProfile",function(username){
    // simulate network latency by sleeping 2s
    Meteor._sleepForMs(2000);
    // try to find the user by username
    var user=Meteor.users.findOne({
        username:username
    });
    // if we can't find it, mark the subscription as ready and quit
    if(!user){
        this.ready();
        return;
    }
    // if the user we want to display the profile is the currently logged in user...
    if(this.userId==user._id){
        // then we return the corresponding full document via a cursor
        return Meteor.users.find(this.userId);
    }
    else{
        // if we are viewing only the public part, strip the "profile"
        // property from the fetched document, you might want to
        // set only a nested property of the profile as private
        // instead of the whole property
        return Meteor.users.find(user._id,{
            fields:{
                "profile":0
            }
        });
    }
});