// History
Meteor.publish('questionsByGameId', function(gameId, number) {
  check(gameId, String);
  check(number, Number);
  this.unblock()

  if (number === -1){
    var sort = {sort: {dateCreated: -1}}
  } else {
    var sort = {sort: {dateCreated: -1}, limit: number}
  }

  var user = this.userId

  var selector = {gameId: gameId, usersAnswered: {$in: [user]}}
  var answerSelector = {userId: this.userId, gameId: gameId}
  return [
    Questions.find(selector, sort),
    Answers.find(answerSelector, sort)
  ]
});