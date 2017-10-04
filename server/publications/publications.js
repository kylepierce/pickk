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
  Counts.publish(this, "liveGamesCount", Games.find({status: "In-Progress"}));
});

Meteor.publish('usersGroups', function ( user ) {
  check(user, Match.Maybe(String));
  this.unblock()
  var selector = {members: {$in: [user]}};
  return Groups.find(selector)
});

Meteor.publish('gamePlayed', function (gameId) {
  check(gameId, String);

  var userId = this.userId
  var game = Games.findOne({_id: gameId});
  var period = game.period

  return GamePlayed.find({userId: userId, gameId: gameId, period: period})
});

// Teams
Meteor.publish('teams', function() {
  this.unblock()
  return Teams.find({})
});

Meteor.publish('singleTeam', function ( id ) {
  check(id, Number);
  this.unblock()
  return Teams.find({statsTeamId: id})
});

Meteor.publish('singleGameTeams', function(team1, team2) {
  check(team1, Number);
  check(team2, Number);
  this.unblock()
  return Teams.find({statsTeamId: {$in: [team1, team2]}})
});

// Questions and Answers
// Active Questions for one game

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
