// History

Meteor.publish('questionsByGameId', function(gameId) {
  check(gameId, String);
  this.unblock()
  var user = this.userId
  return Questions.find({gameId: gameId, usersAnswered: {$in: [user]}});
});

Meteor.publish('answersByGameId', function(gameId) {
  check(gameId, String);
	this.unblock()
  return Answers.find({userId: this.userId, gameId: gameId});
});