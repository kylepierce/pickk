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

Meteor.publish('singleGame', function(id){
  var singleGame = QuestionList.find({gameId: id}, {sort: {dateCreated: 1}});
  if(singleGame){
    return singleGame
  }
  return this.ready();
});

Meteor.publish('findSingle', function(id) {
	return UserList.find({_id: id});
})

Meteor.publish('adminFindSingle', function(id) {
  return UserList.find({_id: id}, {fields: {questionAnswered: 1}});
})

Meteor.publish('userList', function(id) {
  return UserList.find({}, {fields: {_id: 1, "profile.username": 1}});
})

Meteor.publish('adminUserList', function(id) {
  return UserList.find({}, {fields: {_id: 1, "profile.username": 1, "profile.coins": 1, questionAnswered: 1}});
})

Meteor.publish("userData", function () {
  if (this.userId) {
    return UserList.find(
    	{_id: this.userId},
			{fields: 
				{'pendingNotifications': 1, 
				'questionAnswered': 1
				}
			});
  } else {
    this.ready();
  }
});

Meteor.publish('findUserGroups', function(id) {
  return UserList.find(
  	{"profile.groups": id}, 
  	{sort: {'profile.coins': -1}},
  	{fields: 
    	{'profile.username': 1, 
    	 'profile.coins': 1, 
    	 'profile.avatar': 1, 
       'pendingNotifications': 1,
    	 '_id': 1}
    }
  );
})

Meteor.publish('worldLeaderboard', function() {
	var liveGame = Games.findOne({live: true});
  var selector = {_id: {$in: liveGame.users}}
	return UserList.find(
		selector, 
		{fields: 
    	{'profile.username': 1, 
    	 'profile.coins': 1, 
    	 'profile.avatar': 1,
    	 'pendingNotifications': 1, 
    	 '_id': 1}
    }, {fields: {'emails': 0}},
    {sort: {"profile.coins": -1}, limit: 25});
})

Meteor.publish('groups', function() {
  return Groups.find({ });
});

Meteor.publish('games', function() {
  return Games.find({ });
});

Meteor.publish('trophy', function(){
  return Trophies.find({ });
});


Meteor.publish('groupUsers', function(groupId) {
  check(groupId, String);
  var group = Groups.findOne(groupId);
  var selector = {_id: {$in: group.members}}
  var fields = {fields: 
    {'profile.username': 1, 
    'profile.coins': 1, 
    'profile.avatar': 1,
    'pendingNotifications': 1,
    '_id': 1}
  }
  // var options = {fields: {"profile.username": 1}, {"prof"}};
  return UserList.find(selector, fields);
});