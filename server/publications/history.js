// History
Meteor.publish('questionsByGameId', function(gameId, number, prePickks) {
  check(gameId, String);
  check(number, Number);
  check(prePickks, Boolean);
  this.unblock();

  var selector = {gameId: gameId}

  if (number === -1){
    var sort = {sort: {dateCreated: -1}}
  } else {
    var sort = {sort: {dateCreated: -1}, limit: number}
  }
  var user = this.userId
  if (!prePickks){
    selector.usersAnswered = {$in: [user]}
  } else if (prePickks) {
    selector.period = 0
  }

  var answerSelector = {userId: this.userId, gameId: gameId}
  return [
    Questions.find(selector, sort),
    Answers.find(answerSelector, sort)
  ]
});

Meteor.publish('questionHistory', function(questionId) {
  check(questionId, String);
  this.unblock()
  var userId = this.userId;
  var selector = {_id: questionId}
  var answerSelector = {userId: userId, questionId: questionId}
  return [
    Questions.find(selector),
    Answers.find(answerSelector),
    QuestionReport.find(answerSelector)
  ]
});
