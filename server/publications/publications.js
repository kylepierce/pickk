// Global

// isTester = function (userId) {
//   console.log(userId)
//   var user = Meteor.users.findOne(userId);
//   var role = user.profile.role;
//   return role && (role == "admin" || role == "beta");
// };

// Most Common / Basic layout

Meteor.publish("userData", function() {
  if (!this.userId) {
    return this.ready();
  }
  return UserList.find(this.userId);
});

Meteor.publish('unreadNotifications', function() {
  return Notifications.find({userId: this.userId, read: false})  
});

Meteor.publish('userNotifications', function(userId) {
  return Notifications.find({userId: userId, read: false})  
});

Meteor.publish('usersGroups', function ( user ) {
  check(user, String);

  var selector = {"group.members": {$in: user }}
  // Find this user id in any group 
  return Groups.find(selector)
});

// ???? This might be for quick access to playable games. (i.e. has this user already signed up for this game) 
Meteor.publish('gamePlayed', function (user, game) {
  check(user, String);
  check(game, String);

  return GamePlayed.find({userId: user, gameId: game})
});

// Teams
Meteor.publish('teams', function() {
  return Teams.find({})
});

Meteor.publish('singleTeam', function ( teamId ) {
  return Teams.find({_id: teamId})
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
  }, {limit: 3});
});

Meteor.publish('adminActiveQuestions', function(gameId) {
  check(gameId, String);
  
  return Questions.find({
    gameId: gameId,
    active: true,
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
  var selector = {active: "pending"}
  var sort = {sort: {dateCreated: 1}}
  return Questions.find(selector, sort);
});

// All of the games user has played 
Meteor.publish('gamesPlayed', function() {
  var selector = {users: {$in: [this.userId]}}
  var fields = { fields: {_id: 1, id: 1, status: 1, home: 1, away: 1, name: 1, gameDate: 1, tv: 1, dateCreated: 1, live: 1, completed: 1, commercial: 1, scoring: 1, teams: 1, outs: 1,  topOfInning: 1, playersOnBase: 1}}
  return Games.find(selector, fields );
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