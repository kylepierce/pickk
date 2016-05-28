Meteor.publish('activeQuestions', function(){
	var currentUserId = this.userId;
	return QuestionList.find(
				{active: true, 
				usersAnswered: {$nin: [currentUserId]}}, 
				{sort: {dateCreated: 1,}});
});

Meteor.publish('chatMessages', function(groupId){
  var chat = Chat.find({group: groupId}, {sort: {dateCreated: -1}, limit: 10})
  if(chat){
    return chat
  }
  return this.ready();
});


Meteor.publish('userNotAnswered', function(){
	var currentUserId = this.userId;
		return QuestionList.find({active: true}, {sort: {dateCreated: 1}});
});

Meteor.publish('questions', function(){
	var activeQuestions = QuestionList.find({active: true}, {sort: {dateCreated: 1}, limit: 15});
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
	var pendingQuestions = QuestionList.find({active: null}, {sort: {dateCreated: -1}});
	if(pendingQuestions){
		return pendingQuestions
	}
	return this.ready();
});

Meteor.publish('gameQuestions', function(){
  var allQuestions = QuestionList.find({gameId: 'prediction'});
  if(allQuestions){
    return allQuestions
  }
  return this.ready();
})

Meteor.publish('pendingGameQuestions', function(){
  var pendingQuestions = QuestionList.find({active: "pending"}, {sort: {dateCreated: 1}});
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

Meteor.publish('everyQuestions', function(){
  var allQuestions = QuestionList.find({});
  if(allQuestions){
    return allQuestions
  }
  return this.ready();
})

Meteor.publish('questionsUserAnswered', function(user){
  var selector = {usersAnswered: {$in: [user]}}
  return QuestionList.find(selector);
})

Meteor.publish('questionsUserAnsweredSpecificGame', function(user, gameId){
  var selector = { $and: [{ gameId: { $eq: gameId}}, { usersAnswered: { $in: [user] }}]}
  return QuestionList.find(selector, {sort: {dateCreated: 1}});
})


Meteor.publish('singleGame', function(id){
  var singleGame = QuestionList.find({gameId: id}, {sort: {dateCreated: 1}});
  if(singleGame){
    return singleGame
  }
  return this.ready();
});

Meteor.publish('findSingle', function(id) {
  return UserList.find({_id: id},
  {fields: 
      {'profile': 1, 
       '_id': 1
     }
  });
})

Meteor.publish( 'chatUsersList', function( chatId ) {
  // check( chatId, String );

  var singleGame = UserList.find({}, {fields: 
      {'profile.username': 1, 
       'profile.avatar': 1,
       '_id': 1
    }, limit: 10 });
  if(singleGame){
    return singleGame
  }
  return this.ready();
})

Meteor.publish('findSingleUsername', function(id) {
  return UserList.find({_id: id}, 
    {fields: 
      {'profile.username': 1, 
       'profile.coins': 1, 
       'profile.avatar': 1, 
       'pendingNotifications': 1,
       'services': 1,
       '_id': 1
     }
  });
})

Meteor.publish('chatUsers', function(id) {

  return UserList.find({_id: {$in: id}}, 
    {fields: 
      {'profile.username': 1, 
       'profile.coins': 1, 
       'profile.avatar': 1, 
       'pendingNotifications': 1,
       'services': 1,
       '_id': 1
     }
  });
})


Meteor.publish('adminFindSingle', function(id) {
  return UserList.find({_id: id}, {fields: {questionAnswered: 1}});
})

Meteor.publish('userList', function(id) {
  return UserList.find({}, {fields: {_id: 1, "profile.username": 1}, limit: 10});
})

Meteor.publish('adminUserList', function(id) {
  return UserList.find({}, {fields: {_id: 1, "profile.username": 1, "profile.coins": 1, "profile.diamonds": 1, questionAnswered: 1}});
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

// Meteor.publish('worldLeaderboard', function() {
//   Fetcher.retrieve("leaderboard", "loadLeaderboard")
//   var leaderboard = Fetcher.get("leaderboard")
//   var fixed = _.sortBy(leaderboard, function(obj){return obj.profile.coins})
//   return fixed.reverse()
// })

Meteor.publish('groups', function() {
  return Groups.find({ });
});

Meteor.publish('singleGroup', function(groupId) {
  return Groups.find({_id: groupId});
});

Meteor.publish('games', function() {
  return Games.find({ });
});

Meteor.publish('gamesUserPlayedIn', function(user){
  var selector = {users: {$in: [user]}}
  return Games.find(selector);
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



Meteor.publish('activeAtBat', function(){
  return AtBat.find({active: true });
});

Meteor.publish('atBatForThisGame', function(){
  var currentGame = Games.findOne({live: true});
  var currentGameId = currentGame._id
  // return AtBat.find({});
  return AtBat.find({gameId: currentGameId});
});

Meteor.publish('activePlayers', function(){
  var currentGame = Games.find({live: true});
  var teams = Meteor.call('playersPlaying')
  return Players.find({_id: {$in: teams}})
});

Meteor.publish('oneGamePlayers', function(){
  var currentGame = Games.find({live: true});
  var teams = Meteor.call('teamPlaying')
  return Players.find({team: {$in: teams}})
});

Meteor.publish('atBatPlayer', function(){
  var atBat = AtBat.findOne({active: true });
  var playerId = atBat.playerId
  return Players.find({_id: playerId});
});

Meteor.publish('teams', function(){
  return Teams.find({ })
});