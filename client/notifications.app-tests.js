if (Meteor.isClient) {
  beforeEach(function() {
    return Promise.resolve()
      .then(denodeify(function(callback) {return Meteor.call('xolvio:cleaner/resetDatabase', null, callback)}))
      .then(denodeify(function(callback) {return Meteor.call('pickk/populateDatabase', null, callback)}))
  });

  describe('notifications', function() {
    beforeEach(function() {
      // runs before each test in this block
      Meteor.subscribe('notifications')
    });

    it('user is mentioned', function() {
      Meteor.loginWithToken("CharlieDalton");
      return Promise.resolve()
        .then(waitFor(function() {return DDP._allSubscriptionsReady()}))
        .then(denodeify(Tracker.afterFlush))
        .then(denodeify(function(callback) {return Meteor.call("addChatMessage", "CharlieDalton", "@CharlieDalton You are pretty awesome!", callback)}))
        .then(function() {
          assert.equal(Notifications.findOne({userId: "CharlieDalton", senderId: "CharlieDalton"}).message, "@CharlieDalton You are pretty awesome!");
        });
    });

    it('they got free pickk coins', function() {
      Meteor.loginWithToken("CharlieDalton");
      return Promise.resolve()
        .then(waitFor(function() {return DDP._allSubscriptionsReady()}))
        .then(denodeify(Tracker.afterFlush))
        .then(denodeify(function(callback) {return Meteor.call("binaryQuestionAnswered", "BinaryQuestion", "option1",  "500", "Will Erik Smith Hit a Home Run in the 6th inning?", callback)}))
        .then(function() {
          assert.equal(Notifications.find({userId: "CharlieDalton", questionId: "BinaryQuestion", gameId: "ActiveGame"}).count(), 1);
        })
    });

    it('that they won normal play', function() {
      Meteor.loginWithToken("CharlieDalton");
      return Promise.resolve()
        .then(waitFor(function() {return DDP._allSubscriptionsReady()}))
        .then(denodeify(Tracker.afterFlush))
        .then(denodeify(function(callback) {return Meteor.call("questionAnswered", "PitchQuestion", "option1", "250", "Strike", callback)}))
        .then(denodeify(function(callback) {return Meteor.call("deactivateStatus", "PitchQuestion", callback)}))
        .then(denodeify(function(callback) {return Meteor.call("modifyQuestionStatus", "PitchQuestion", "option1", callback)}))
        .then(function() {
          assert.equal(Notifications.find({userId: "CharlieDalton", questionId: "PitchQuestion"}).count(), 1);
        })
    });

    it('that someone followed them', function() {
      Meteor.loginWithToken("KnoxOverstreet");
      return Promise.resolve()
        .then(waitFor(function() {return DDP._allSubscriptionsReady()}))
        .then(denodeify(Tracker.afterFlush))
        .then(denodeify(function(callback) {return Meteor.call("followUser", "KnoxOverstreet", "CharlieDalton", callback)}))
        .then(function() {
          assert.equal(Notifications.find({userId: "CharlieDalton", senderId: "KnoxOverstreet", type: "follower"}).count(), 1);
        })
    });

    it('someone invited them to a group', function() {
      Meteor.loginWithToken("KnoxOverstreet");
      return Promise.resolve()
        .then(waitFor(function() {return DDP._allSubscriptionsReady()}))
        .then(denodeify(Tracker.afterFlush))
        .then(denodeify(function(callback) {return Meteor.call("inviteToGroup", "CharlieDalton", "KnoxOverstreet", "Overlords", callback)}))
        .then(function() {
          assert.equal(Notifications.find({userId: "CharlieDalton", senderId: "KnoxOverstreet", type: "group" }).count(), 1);
        })
    });

    it('they won diamonds', function() {
      Meteor.loginWithToken("CharlieDalton");
      return Promise.resolve()
        .then(waitFor(function() {return DDP._allSubscriptionsReady()}))
        .then(denodeify(Tracker.afterFlush))
        .then(denodeify(function(callback) {return Meteor.call("awardDiamonds", "CharlieDalton", 50, callback)}))
        .then(function() {
          assert.equal(Notifications.findOne({userId: "CharlieDalton", type: "diamonds"}).message, "You Earned 50 Diamonds!");
        })
    });    
  })
}
