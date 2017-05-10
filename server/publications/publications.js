// Global

// Most Common / Basic layout

Meteor.publish("userData", function() {
  if (!this.userId) {
    return this.ready();
  }
  return UserList.find(this.userId,
    {
      fields: {
        'createdAt': 1,
      }
    });
});

Meteor.publish("liveGamesCount", function() {
  this.unblock()
  Counts.publish(this, "liveGamesCount", Games.find({status: "inprogress"}));
});

Meteor.publish('usersGroups', function ( user ) {
  check(user, Match.Maybe(String));
  this.unblock()
  var selector = {members: {$in: [user]}};
  // Find this user id in any group
  return Groups.find(selector)
});

// ???? This might be for quick access to playable games. (i.e. has this user already signed up for this game)
Meteor.publish('gamePlayed', function (user, gameId) {
  check(user, String);
  check(gameId, String);
  // check(period, Number);

  var game = Games.find({_id: gameId }).fetch()
  var period = game[0].period

  return GamePlayed.find({userId: user, gameId: gameId, period: period})
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
Meteor.publish('activeQuestions', function(gameId, period) {
  check(gameId, String);
  check(period, Number);
  var game = Games.find({_id: gameId }).fetch()

  // this.unblock()
  var currentUserId = this.userId;

  if(game){
    var questions = Questions.find({
      gameId: gameId,
      active: true,
      period: period,
      commercial: false,
      usersAnswered: {$nin: [currentUserId]}
    }, {sort: {dateCreated: -1}, limit: 1});
    return questions
  }

  return this.ready();
});

Meteor.publish('activePropQuestions', function(gameId, period) {
  check(gameId, String);
  check(period, Number);
  this.unblock()

  var game = Games.find({_id: gameId }).fetch()
  var currentUserId = this.userId;

  if(game){
    return Questions.find({
      gameId: gameId,
      active: true,
      period: period,
      type: "prop",
      usersAnswered: {$nin: [currentUserId]}
    }, {sort: {dateCreated: -1}, limit: 1});
  }

  return this.ready();
});

Meteor.publish('activeCommQuestions', function(gameId, period) {
  check(gameId, String);
  check(period, Number);
  this.unblock()

  var game = Games.find({_id: gameId }).fetch()
  var currentUserId = this.userId;
  if(game){
    return Questions.find({
      gameId: gameId,
      active: true,
      period: period,
      commercial: true,
      usersAnswered: {$nin: [currentUserId]}
    }, {sort: {dateCreated: 1}, limit: 1});
  }

  return this.ready();
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
  var fields = { fields: {_id: 1, id: 1, status: 1, home: 1, away: 1, name: 1,  tv: 1, dateCreated: 1, live: 1, completed: 1, commercial: 1, scoring: 1, teams: 1, outs: 1,  topOfInning: 1, playersOnBase: 1, users: 1}}
  return Games.find(selector, fields );
});

// Miscellaneous

Meteor.publish('findSingle', function(id) {
  check(id, String);
  this.unblock()
  var fields = {fields: {'createdAt': 1,'profile': 1,'_id': 1, 'pendingNotifications': 1}}
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
