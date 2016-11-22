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
  return UserList.find(this.userId,
    {
      fields: {
        'notifications': 1,
        'pendingNotifications': 1
      }
    });
});

Meteor.publish('unreadNotifications', function() {
  this.unblock()
  return Notifications.find({userId: this.userId, read: false}, {sort: {dateCreated: -1}})  
});

Meteor.publish('userNotifications', function(userId) {
  check(userId, String);
  this.unblock()
  return Notifications.find({userId: userId, read: false})  
});

Meteor.publish('gameNotifications', function(gameId) {
  check(gameId, String);
  this.unblock()
  var userId = this.userId;
  return Notifications.find({gameId: gameId, userId: userId, read: false})  
});


Meteor.publish('usersGroups', function ( user ) {
  check(user, Match.Maybe(String));
  this.unblock()
  var selector = {members: {$in: [user]}};
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
  this.unblock()
  return Teams.find({})
});

Meteor.publish('singleTeam', function ( teamId ) {
  check(teamId, String);
  this.unblock()
  return Teams.find({_id: teamId})
});

// Questions and Answers
// Active Questions for one game
Meteor.publish('activeQuestions', function(gameId) {
  check(gameId, String);
  // this.unblock()
  var currentUserId = this.userId;
    return Questions.find({
      gameId: gameId,
      active: true,
      commercial: false, 
      usersAnswered: {$nin: [currentUserId]}
    }, {sort: {dateCreated: -1}, limit: 1});
});

Meteor.publish('activePropQuestions', function(gameId) {
  check(gameId, String);
  this.unblock()
  var currentUserId = this.userId;
  return Questions.find({
    gameId: gameId,
    active: true,
    type: "prop",
    usersAnswered: {$nin: [currentUserId]}
  }, {sort: {dateCreated: -1}, limit: 1});
});

Meteor.publish('activeCommQuestions', function(gameId) {
  check(gameId, String);
  this.unblock()
  var currentUserId = this.userId;
  return Questions.find({
    gameId: gameId,
    active: true,
    commercial: true, 
    usersAnswered: {$nin: [currentUserId]}
  }, {sort: {dateCreated: 1}, limit: 1});
});

// Meteor.publish('adminActiveQuestions', function(gameId) {
//   check(gameId, String);
//   var selector = {gameId: gameId, active: {$ne: false}}
//   return Questions.find(selector);
// });

Meteor.publish('gameQuestions', function() {
  return Questions.find({type: 'prediction', active: {$ne: false}});
});

// All of the games user has played 
Meteor.publish('gamesPlayed', function() {
  var selector = {users: {$in: [this.userId]}}
  var fields = { fields: {_id: 1, id: 1, status: 1, home: 1, away: 1, name: 1, gameDate: 1, tv: 1, dateCreated: 1, live: 1, completed: 1, commercial: 1, scoring: 1, teams: 1, outs: 1,  topOfInning: 1, playersOnBase: 1, users: 1}}
  return Games.find(selector, fields );
});

// Miscellaneous

Meteor.publish('findSingle', function(id) {
  check(id, String);
  this.unblock()
  var fields = {fields: {'profile': 1,'_id': 1, 'pendingNotifications': 1}}
  return UserList.find({_id: id}, fields);
});

Meteor.publish('trophy', function() {
  this.unblock()
  return Trophies.find({});
});

Meteor.publish('betaList', function() {
  var selector = {"profile.beta_request": true}
  return UserList.find(selector)
});