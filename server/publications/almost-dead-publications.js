// !!!! Bad news bears, but has /friends attached to it.
Meteor.publish('userList', function(id) {
  return UserList.find({}, {fields: {_id: 1, "profile.username": 1, "profile.avatar": 1}, limit: 10});
});


// ????
Meteor.publish('followingUserList', function() {
  if (!this.userId) {
    return this.ready()
  }
  var currentUser = UserList.findOne(this.userId);
  return UserList.find({_id: {$in: currentUser.profile.following}}, {
    fields: {
      _id: 1,
      "profile.username": 1,
      "profile.avatar": 1
    }, limit: 10
  });
});



// Almost Dead

// Remove soon

Meteor.publish('groups', function() {
  return Groups.find({});
});

Meteor.publish('questions', function() {
  var activeQuestions = Questions.find({active: true}, {sort: {dateCreated: 1}, limit: 15});
  if (activeQuestions) {
    return activeQuestions
  }
  return this.ready();
});

Meteor.publish('oldQuestions', function() {
  var oldQuestions = Questions.find({active: false}, {sort: {dateCreated: -1}, limit: 3});
  if (oldQuestions) {
    return oldQuestions
  }
  return this.ready();
});

Meteor.publish('pendingQuestions', function() {
  var pendingQuestions = Questions.find({active: null}, {sort: {dateCreated: -1}});
  if (pendingQuestions) {
    return pendingQuestions
  }
  return this.ready();
});

Meteor.publish('SportRadarGames', function() {
  const today = moment().toDate();
  const tomorrow = moment().add("days", 1).toDate();

  return SportRadarGames.find({scheduled: {$gt: today, $lt: tomorrow}});
});

// ???? This could be combined with findSingle if I dont decide to do everything through router.
Meteor.publish('findSingleUsername', function(id) {
  var fields = { fields: {
    'profile.username': 1,
    'profile.avatar': 1,
    'services': 1,
    '_id': 1
  }}
  return UserList.find({_id: id}, fields);
});



// Test and Remove

// Meteor.publish('answersByUser', function (id) {
//   check(id, String);

//   var selector = {"userId": id}
//   return Answers.find(selector)
// });


// Meteor.publish('currentAnswers', function() {
//   var currentGame = Games.findOne({live: true})
//   currentGame = currentGame._id
//   return Answers.find({userId: this.userId, gameId: currentGame}, {sort: {dateCreated: -1}, limit: 3});
// })

// Meteor.publish('singleGame', function(id) {
//   var singleGame = Questions.find({gameId: id}, {sort: {dateCreated: 1}});
//   if (singleGame) {
//     return singleGame
//   }
//   return this.ready();
// });

// Meteor.publish('futureTasks', function() {
//   return FutureTasks.find({})
// });

// Meteor.publish('oneGamePlayers', function() {
//   var currentGame = Games.find({live: true});
//   var teams = Meteor.call('teamPlaying')
//   return Players.find({team: {$in: teams}})
// });

// Meteor.publish('notifications', function() {
//   return Notifications.find({})
// });

// Meteor.publish('allQuestions', function(game) {
//   var allQuestions = Questions.find({gameId: game});
//   if (allQuestions) {
//     return allQuestions
//   }
//   return this.ready();
// })

// Meteor.publish('everyQuestions', function() {
//   var allQuestions = Questions.find({});
//   if (allQuestions) {
//     return allQuestions
//   }
//   return this.ready();
// })

// Meteor.publish('adminUserList', function(id) {
//   return UserList.find({}, {
//     fields: {
//       _id: 1,
//       "profile.username": 1,
//       "profile.avatar": 1,
//       "profile.diamonds": 1
//     }
//   });
// })

// Meteor.publish('atBatForThisGame', function() {
//   var currentGame = Games.findOne({live: true});
//   var currentGameId = currentGame._id
//   // return AtBat.find({});
//   return AtBat.find({gameId: currentGameId});
// });