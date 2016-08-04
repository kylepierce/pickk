// Global

isTester = function (userId) {
  var user = Meteor.users.findOne(userId);
  var role = user.profile.role;
  return role && (role == "admin" || role == "beta");
};

// Most Common / Basic layout

Meteor.publish("userData", function() {
  if (!this.userId) {
    return this.ready();
  }
  return UserList.find(this.userId);
});

Meteor.publish('unreadNotifications', function(user) {
  check(user, String);

  return Notifications.find({userId: user, read: false})  
});

Meteor.publish('usersGroups', function ( user ) {
  check(user, String);

  var selector = {"group.members": {$in: user }}
  // Find this user id in any group 
  return Groups.find(selector)
});





// Upcomming Games

Meteor.publish('game', function(_id) {
  check(_id, String);
  return Games.find({_id: _id}, 
    {fields: {
      _id: 1, id: 1, status: 1, coverage: 1, game_number: 1, day_night: 1, scheduled: 1, home_team: 1, away_team: 1, venue: 1, broadcast: 1, home: 1, away: 1, name: 1, gameDate: 1, tv: 1, dateCreated: 1, live: 1, completed: 1, commercial: 1, scoring: 1, teams: 1, outs: 1, inning: 1, topOfInning: 1, playersOnBase: 1, users: 1, nonActive: 1, commercialStartedAt: 1, 
    }});
});

// All Games for the next 3 days
Meteor.publish('games', function() {
  const today = moment().startOf('day').toDate();
  const tomorrow = moment().startOf('day').add(2, "days").toDate(); // today and tomorrow

  var selector = {scheduled: {$gt: today, $lt: tomorrow}};
  var parms = {sort: {scheduled: -1}, fields: {_id: 1, id: 1, name: 1, tv: 1, gameDate: 1, status: 1, scheduled: 1}}

  var tester = isTester(this.userId);
  if ( ! tester) {
    selector.public = true;
  }

  return Games.find(selector, parms);
});


// ???? This might be for quick access to playable games. (i.e. has this user already signed up for this game) 
Meteor.publish('gamePlayed', function (user, game) {
  check(user, String);
  check(game, String);

  return GamePlayed.find({userId: user, gameId: game})
});


// Only live games
Meteor.publish('activeGames', function() {
  var selector = {live: true, status: "inprogress"} 
  var parms = {sort: {gameDate: 1}, fields: {name: 1, tv: 1, gameDate: 1, status: 1}}

  var tester = isTester(this.userId);
  if ( ! tester) {
    selector.public = true;
  }

  return Games.find(selector, parms);
});

// Teams
Meteor.publish('teams', function() {
  return Teams.find({})
});



// At Bat 
Meteor.publish('activeAtBat', function(gameId) {
  check(gameId, String);
  
  return AtBat.find({gameId: gameId, active: true});
});

Meteor.publish('activePlayers', function(gameId) {
  check(gameId, String);
  
  // Fix Next
  // var fields = {
  //   name: 
  // }
  var teams = Meteor.call('playersPlaying', gameId);
  return Players.find({_id: {$in: teams}})
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



// Questions and Answers
// Active Questions for one game
Meteor.publish('activeQuestions', function(gameId) {
  check(gameId, String);
  
  var currentUserId = this.userId;
  return Questions.find({
    gameId: gameId,
    active: true,
    usersAnswered: {$nin: [currentUserId]}
  });
});

Meteor.publish('gameQuestions', function() {
  var allQuestions = Questions.find({gameId: 'prediction'});
  if (allQuestions) {
    return allQuestions
  }
  return this.ready();
});

Meteor.publish('pendingGameQuestions', function() {
  var pendingQuestions = Questions.find({active: "pending"}, {sort: {dateCreated: 1}});
  if (pendingQuestions) {
    return pendingQuestions
  }
  return this.ready();
});



// History

Meteor.publish('questionsByGameId', function(gameId) {
  check(gameId, String);

  return Questions.find({gameId: gameId});
});

Meteor.publish('answersByGameId', function(gameId) {
  check(gameId, String);

  return Answers.find({userId: this.userId, gameId: gameId});
});

// All of the games user has played 
Meteor.publish('gamesPlayed', function() {
  var selector = {users: {$in: [this.userId]}}
  return Games.find(selector);
});


// Miscellaneous

Meteor.publish('findSingle', function(id) {
  check(id, String);

  var fields = {fields: {'profile': 1,'_id': 1}}
  return UserList.find({_id: id}, fields);
});

Meteor.publish('trophy', function() {
  return Trophies.find({});
});

Meteor.publish('betaList', function() {
  var selector = {"profile.beta_request": true}
  return UserList.find(selector)
});

Meteor.publish('leaderboardGamePlayed', function(game) {
  check(game, String);

  return GamePlayed.find({gameId: game})
});