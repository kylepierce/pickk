Meteor.methods({
  'fixPreGame': function(gameId){
    // Find all questions with gameId and period 0
    var questions = Questions.find({ gameId: gameId, period: 0 }).fetch();
    var users = []

    // Which players actually played.
    _.map(questions, function(question){
      users = _.union(users, question.usersAnswered)
    });

    // For each question Set all of the answers wager to 2500
    _.map(questions, function(que){
      Answers.update({questionId: que._id}, {$set: {wager: 2500, period: 0}}, {multi: true});
      var count = Answers.find({ questionId: que._id }).fetch()
    });

    var playedBy = GamePlayed.find({gameId: gameId, period: 0}, {fields: {queCounter: 1, coins: 1}}).fetch();
    console.log(playedBy)
    _.map(users, function(player){
      // Count by user 
      var count = Answers.find({userId: player, gameId: gameId, period: 0}).count()
      var coins = 15000 - (count * 2500)
      // Update user count
      // GamePlayed.update({ gameId: gameId, userId: player, period: 0 }, { $set: { queCounter: count, coins: coins }}, { multi: true })
      var details = GamePlayed.find({ gameId: gameId, userId: player, period: 0 }, { fields: { queCounter: 1, coins: 1 } }).fetch();
      console.log(details);
    });
    var playedBy = GamePlayed.find({ gameId: gameId, period: 0 }, { fields: { userId: 1, queCounter: 1, coins: 1 } }).fetch();
    console.log(users.length, playedBy)
  }
})
