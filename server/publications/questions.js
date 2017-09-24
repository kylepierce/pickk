Meteor.publish("questionCount", function(gameId) {
  check(gameId, String);
  this.unblock()

  var userId = this.userId
  var game = Games.findOne({_id: gameId});
  var period = game.period
  var commercial = game.commercial
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
  } else {
  }
  var data = Questions.find(selector)
  Counts.publish(this, "questionCount", data);
});

Meteor.publish('userQuestions', function(gameId, commercial) {
  check(gameId, String);
  check(commercial, Boolean);
  var userId = this.userId;
  var game = Games.findOne({_id: gameId});
  var period = game.period
  var gamePlayed = GamePlayed.findOne({userId: userId, gameId: gameId, period: period});

  if(game){
    var selector = {
      gameId: gameId,
      active: true,
      period: period,
      commercial: commercial,
      usersAnswered: {$nin: [userId]}
    }
    var sort = {sort: {dateCreated: -1}, limit: 1}

    if (gamePlayed.type === "live"){
      if (game.commercial === false){
        var finish = Chronos.moment().subtract(gamePlayed.timeLimit, "seconds").toDate();
        selector['dateCreated'] = {$gt: finish}
      }
      selector['type'] = {$in: ["prop", "play", "atBat", "pitch", "drive", "freePickk"]}
    } else if (gamePlayed.type === "atbat"){
      if (game.commercial === false){
        var finish = Chronos.moment().subtract(gamePlayed.timeLimit, "seconds").toDate();
        selector['dateCreated'] = {$gt: finish}
      }
      selector['type'] = {$in: ["prop", "atBat", "drive", "freePickk"]}
    } else if (gamePlayed.type === "drive"){
      selector['type'] = {$in: ["prop", "atBat", "drive", "freePickk"]}
    }
    var count = Questions.find(selector, sort).count();
    return Questions.find(selector, sort);
  }
});

Meteor.publish('preGamePickks', function(gameId) {
  check(gameId, String);
  var userId = this.userId;
  var game = Games.findOne({_id: gameId});

  if(game){
    var selector = {
      gameId: gameId,
      active: true,
      period: 0,
      // usersAnswered: {$nin: [userId]}
    }
    // var sort = {sort: {dateCreated: -1}, limit: 1}
    return Questions.find(selector);
  }
});
