if (Meteor.isClient) {
  beforeEach(function() {
    return Promise.resolve()
      .then(denodeify(function(callback) {return Meteor.call('xolvio:cleaner/resetDatabase', null, callback)}))
      .then(denodeify(function(callback) {return Meteor.call('pickk/populateDatabase', null, callback)}))
  });

  describe('questions & answers', function() {
    beforeEach(function() {
      // runs before each test in this block
      Meteor.subscribe('gamePlayed', "CharlieDalton", "NoOutsGame")
      Meteor.subscribe('notifications')
    });

    it('gives coins for a correct answer', function() {
      Meteor.loginWithToken("CharlieDalton");
      return Promise.resolve()
        .then(waitFor(function() {return DDP._allSubscriptionsReady()}))
        .then(denodeify(Tracker.afterFlush))
        .then(denodeify(function(callback) {return Meteor.call("questionAnswered", "PitchQuestion", "option1", "250", "Strike", callback)}))
        .then(denodeify(function(callback) {return Meteor.call("deactivateStatus", "PitchQuestion", callback)}))
        .then(denodeify(function(callback) {return Meteor.call("modifyQuestionStatus", "PitchQuestion", "option1", callback)}))
        .then(function() {
          assert.equal(GamePlayed.findOne({gameId: "NoOutsGame", userId: "CharlieDalton"}).coins, 10275);
        });
    });

    it('does not give coins for an incorrect answer', function() {
      Meteor.loginWithToken("CharlieDalton");
      return Promise.resolve()
        .then(waitFor(function() {return DDP._allSubscriptionsReady()}))
        .then(denodeify(Tracker.afterFlush))
        .then(denodeify(function(callback) {return Meteor.call("questionAnswered", "PitchQuestion", "option3", "500", "Hit", callback)}))
        .then(denodeify(function(callback) {return Meteor.call("deactivateStatus", "PitchQuestion", callback)}))
        .then(denodeify(function(callback) {return Meteor.call("modifyQuestionStatus", "PitchQuestion", "option1", callback)}))
        .then(function() {
          assert.equal(GamePlayed.findOne({gameId: "NoOutsGame", userId: "CharlieDalton"}).coins, 9500);
        });
    });
  })
}
