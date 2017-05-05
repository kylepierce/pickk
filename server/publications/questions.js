Meteor.publish("questionCount", function(userId, gameId, period, commercial) {
  check(userId, String);
  check(gameId, String);
  check(period, Number);
  check(commercial, Boolean);
  this.unblock()

  var gamePlayed = GamePlayed.find({userId: userId, gameId: gameId, period: period}).fetch()
  if(gamePlayed){
    var timeLimit = gamePlayed[0].timeLimit
    var gameType = gamePlayed[0].type
  }

  if (gameType === "live"){
    if (commercial === true) {
      var selector = {
        active: true,
        gameId: gameId,
        period: period,
        type: {$in: ["prop", "drive", "freePickk"]},
        usersAnswered: {$nin: [userId]}
      }
    } else if (commercial === false){
      var finish = Chronos.moment().subtract(timeLimit, "seconds").toDate();
      var selector = {
        active: true,
        gameId: gameId,
        period: period,
        type: {$in: ["prop", "play", "atBat", "pitch"]},
        usersAnswered: {$nin: [userId]},
        dateCreated: {$gt: finish}
      }
    }
  } else if (gameType === "drive" || gameType === "proposition") {
    if (commercial === true){
      var selector = {
        active: true,
        gameId: gameId,
        period: period,
        type: {$in: ["prop", "drive", "freePickk"]},
        usersAnswered: {$nin: [userId]}
      }
    }
    else if (commercial === true){
      var selector = {
        active: true,
        gameId: gameId,
        period: period,
        type: {$in: ["prop"]},
        usersAnswered: {$nin: [userId]}
      }
    }
  }

  var data = Questions.find(selector)
  Counts.publish(this, "questionCount", data);
});
