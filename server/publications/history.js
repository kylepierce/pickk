// History

Meteor.publish('questionsByGameId', function(gameId, number) {
  check(gameId, String);
  check(number, Number);
  this.unblock()

  var user = this.userId
  var selector = {gameId: gameId, usersAnswered: {$in: [user]}}
  return Questions.find(selector, {limit: number});
});

Meteor.publish('answersByGameId', function(gameId, number) {
  check(gameId, String);
  check(number, Number);
	this.unblock()

	var selector = {userId: this.userId, gameId: gameId}
  return Answers.find(selector, {limit: number});
});