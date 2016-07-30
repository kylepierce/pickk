isTester = function (userId) {
  var user = Meteor.users.findOne(userId);
  var role = user.profile.role;
  return role && (role == "admin" || role == "beta");
};

Meteor.publish('activeQuestions', function(gameId) {
  check(gameId, String);
  
  var currentUserId = this.userId;
  return Questions.find({
    gameId: gameId,
    active: true,
    usersAnswered: {$nin: [currentUserId]}
  });
});

Meteor.publish('chatMessages', function(groupId, limit) {
  limit = limit || 10;
  return Chat.find({group: groupId}, {sort: {dateCreated: -1}, limit: limit});
});

Meteor.publish("chatMessagesCount", function(groupId) {
  Counts.publish(this, "chatMessagesCount", Chat.find({group: groupId}));
});

Meteor.publish('questions', function() {
  var activeQuestions = Questions.find({active: true}, {sort: {dateCreated: 1}, limit: 15});
  if (activeQuestions) {
    return activeQuestions
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

Meteor.publish('gameQuestions', function() {
  var allQuestions = Questions.find({gameId: 'prediction'});
  if (allQuestions) {
    return allQuestions
  }
  return this.ready();
})

Meteor.publish('pendingGameQuestions', function() {
  var pendingQuestions = Questions.find({active: "pending"}, {sort: {dateCreated: 1}});
  if (pendingQuestions) {
    return pendingQuestions
  }
  return this.ready();
});

Meteor.publish('oldQuestions', function() {
  var oldQuestions = Questions.find({active: false}, {sort: {dateCreated: -1}, limit: 3});
  if (oldQuestions) {
    return oldQuestions
  }
  return this.ready();
})

Meteor.publish('allQuestions', function(game) {
  var allQuestions = Questions.find({gameId: game});
  if (allQuestions) {
    return allQuestions
  }
  return this.ready();
})

Meteor.publish('everyQuestions', function() {
  var allQuestions = Questions.find({});
  if (allQuestions) {
    return allQuestions
  }
  return this.ready();
})

Meteor.publish('questionsByGameId', function(gameId) {
  check(gameId, String);
  return Questions.find({gameId: gameId});
})

Meteor.publish('answersByGameId', function(gameId) {
  check(gameId, String);
  return Answers.find({userId: this.userId, gameId: gameId});
})

Meteor.publish('currentAnswers', function() {
  var currentGame = Games.findOne({live: true})
  currentGame = currentGame._id
  return Answers.find({userId: this.userId, gameId: currentGame}, {sort: {dateCreated: -1}, limit: 3});
})

Meteor.publish('singleGame', function(id) {
  var singleGame = Questions.find({gameId: id}, {sort: {dateCreated: 1}});
  if (singleGame) {
    return singleGame
  }
  return this.ready();
});

Meteor.publish('findSingle', function(id) {
  return UserList.find({_id: id},
    {
      fields: {
        'profile': 1,
        '_id': 1
      }
    });
})

Meteor.publish('chatUsersList', function(groupId) {
  // check( groupId, String );

  groupId = groupId || null;

  var messages = Chat.find({group: groupId}, {fields: {user: 1}},{ limit: 10}).fetch();
  var userIds = _.chain(messages).pluck("user").uniq().value();

  var users = UserList.find({_id: {$in: userIds}}, {
    fields: {
      'profile.username': 1,
      'profile.avatar': 1,
      '_id': 1
    }
  });
  return users;
});

Meteor.publish('findSingleUsername', function(id) {
  return UserList.find({_id: id},
    {
      fields: {
        'profile.username': 1,
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
    {
      fields: {
        'profile.username': 1,
        'profile.coins': 1,
        'profile.avatar': 1,
        'pendingNotifications': 1,
        'services': 1,
        '_id': 1
      }
    });
})

Meteor.publish("chatUsersAutocomplete", function(selector, options) {
  if (!this.userId) {
    return this.ready()
  }
  if (_.isEmpty(selector)) {
    return this.ready()
  }
  options.limit = Math.min(5, Math.abs(options.limit || 5));
  Autocomplete.publishCursor(UserList.find(selector, options), this);
  return this.ready()
})


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
})

Meteor.publish('userList', function(id) {
  return UserList.find({}, {fields: {_id: 1, "profile.username": 1, "profile.avatar": 1}, limit: 10});
})

Meteor.publish('adminUserList', function(id) {
  return UserList.find({}, {
    fields: {
      _id: 1,
      "profile.username": 1,
      "profile.avatar": 1,
      "profile.coins": 1,
      "profile.diamonds": 1
    }
  });
})

Meteor.publish("userData", function() {
  if (!this.userId) {
    return this.ready();
  }
  return UserList.find(this.userId,
    {
      fields: {
        'pendingNotifications': 1
      }
    });
});

Meteor.publish('findUserGroups', function(id) {
  return UserList.find(
    {"profile.groups": id},
    {sort: {'profile.coins': -1}},
    {
      fields: {
        'profile.username': 1,
        'profile.coins': 1,
        'profile.avatar': 1,
        'pendingNotifications': 1,
        '_id': 1
      }
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
  return Groups.find({});
});

Meteor.publish('singleGroup', function(groupId) {
  return Groups.find({_id: groupId});
});

Meteor.publish('game', function(_id) {
  check(_id, String);
  return Games.find({_id: _id});
});

Meteor.publish('games', function() {
  const today = moment().startOf('day').toDate();
  const tomorrow = moment().startOf('day').add(2, "days").toDate(); // today and tomorrow

  var selector = {scheduled: {$gt: today, $lt: tomorrow}};
  var parms = {sort: {scheduled: 1}, fields: {name: 1, tv: 1, gameDate: 1, status: 1, scheduled: 1}}

  var tester = isTester(this.userId);
  if ( ! tester) {
    selector.public = true;
  }

  return Games.find(selector, parms);
});

Meteor.publish('gamesPlayed', function() {
  return Games.find({users: this.userId});
});

Meteor.publish('SportRadarGames', function() {
  const today = moment().toDate();
  const tomorrow = moment().add("days", 1).toDate();

  return SportRadarGames.find({scheduled: {$gt: today, $lt: tomorrow}});
});

Meteor.publish('activeGames', function() {
  var selector = {live: true} 
  var parms = {sort: {gameDate: 1}, fields: {name: 1, tv: 1, gameDate: 1, status: 1}}

  var tester = isTester(this.userId);
  if ( ! tester) {
    selector.public = true;
  }

  return Games.find(selector, parms);
});

Meteor.publish('trophy', function() {
  return Trophies.find({});
});


Meteor.publish('groupUsers', function(groupId) {
  check(groupId, String);
  var group = Groups.findOne(groupId);
  var selector = {_id: {$in: group.members}}
  var fields = {
    fields: {
      'profile.username': 1,
      'profile.coins': 1,
      'profile.avatar': 1,
      'pendingNotifications': 1,
      '_id': 1
    }
  }
  // var options = {fields: {"profile.username": 1}, {"prof"}};
  return UserList.find(selector, fields);
});


Meteor.publish('activeAtBat', function(gameId) {
  check(gameId, String);
  
  return AtBat.find({gameId: gameId, active: true});
});

Meteor.publish('atBatForThisGame', function() {
  var currentGame = Games.findOne({live: true});
  var currentGameId = currentGame._id
  // return AtBat.find({});
  return AtBat.find({gameId: currentGameId});
});

Meteor.publish('activePlayers', function(gameId) {
  check(gameId, String);
  
  var teams = Meteor.call('playersPlaying', gameId);
  return Players.find({_id: {$in: teams}})
});

Meteor.publish('oneGamePlayers', function() {
  var currentGame = Games.find({live: true});
  var teams = Meteor.call('teamPlaying')
  return Players.find({team: {$in: teams}})
});

Meteor.publish('atBatPlayer', function(gameId) {
  check(gameId, String);

  var atBat = AtBat.findOne({gameId: gameId, active: true});
  if (atBat) {
    var playerId = atBat.playerId
    return Players.find({_id: playerId});
  } else {
    return this.ready();
  }
});

Meteor.publish('teams', function() {
  return Teams.find({})
});

Meteor.publish('futureTasks', function() {
  return FutureTasks.find({})
})
