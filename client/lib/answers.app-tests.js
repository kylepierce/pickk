if (Meteor.isClient) {
  beforeEach(function() {
    return Promise.resolve()
      .then(denodeify(function(callback) {return Meteor.call('xolvio:cleaner/resetDatabase', null, callback)}))
      .then(denodeify(function(callback) {return Meteor.call('pickk/populateDatabase', null, callback)}))
  });

  describe('questions & answers', function() {
    beforeEach(function() {
      // runs before each test in this block
      Meteor.subscribe('gamePlayed', "NoOutsGame")
      Meteor.subscribe('notifications')
      
    });

    it('gives coins for a correct answer', function() {
      Meteor.loginWithToken("CharlieDalton");
      var prediction = {
        gameId: "NoOutsGame",
        period: 1,
        questionId: "PitchQuestion",
        type: "live",
        answered: "option1",
        multiplier: 2.1,
        wager: 250
      }
      var modify = {
        questionId: "PitchQuestion",
        option: "option1"
      }
      return Promise.resolve()
        .then(waitFor(function() {return DDP._allSubscriptionsReady()}))
        .then(denodeify(Tracker.afterFlush))
        .then(denodeify(function (callback) { return Meteor.call("answerNormalQuestion", prediction, callback)}))
        .then(denodeify(function(callback) {return Meteor.call("deactivateStatus", "PitchQuestion", callback)}))
        .then(denodeify(function (callback) { return Meteor.call("modifyQuestionStatus", modify, callback)}))
        .then(function() {
          assert.equal(GamePlayed.findOne({period: 1, gameId: "NoOutsGame", userId: "CharlieDalton"}).coins, 10275);
        });
    });

    it('does not give coins for an incorrect answer', function() {
      Meteor.loginWithToken("CharlieDalton");
      var prediction = {
        gameId: "NoOutsGame",
        period: 1,
        questionId: "PitchQuestion",
        type: "live",
        answered: "option1",
        multiplier: 2.1,
        wager: 500
      }
      var modify = {
        questionId: "PitchQuestion",
        option: "option2"
      }
      return Promise.resolve()
        .then(waitFor(function() {return DDP._allSubscriptionsReady()}))
        .then(denodeify(Tracker.afterFlush))
        .then(denodeify(function (callback) {return Meteor.call("answerNormalQuestion", prediction, callback)}))
        .then(denodeify(function(callback) {return Meteor.call("deactivateStatus", "PitchQuestion", callback)}))
        .then(denodeify(function(callback) {return Meteor.call("modifyQuestionStatus", modify, callback)}))
        .then(function() {
          assert.equal(GamePlayed.findOne({gameId: "NoOutsGame", userId: "CharlieDalton"}).coins, 9500);
        });
    });
  })
}
