if (Meteor.isClient) {
  beforeEach(function() {
    return Promise.resolve()
      .then(denodeify(function(callback) {return Meteor.call('xolvio:cleaner/resetDatabase', null, callback)}))
      .then(denodeify(function(callback) {return Meteor.call('pickk/populateDatabase', null, callback)}))
  });

  describe('question notifications', function() {
    beforeEach(function() {
      // runs before each test in this block
      Meteor.subscribe('userData')
      Meteor.subscribe('activeGames')
      Meteor.subscribe('gamePlayed', "CharlieDalton", "NoOutsGame")
      Meteor.subscribe('unreadNotifications, "CharlieDalton"')
    });

    it('got free pickk coins', function() {
      Meteor.loginWithToken("CharlieDalton");
      return Promise.resolve()
        .then(waitFor(function() {return DDP._allSubscriptionsReady()}))
        .then(denodeify(Tracker.afterFlush))
        .then(denodeify(function(callback) {return Meteor.call("binaryQuestionAnswered", "BinaryQuestion", "option1",  "500", "Will Erik Smith Hit a Home Run in the 6th inning?", callback)}))
        .then(function() {
          assert.equal(Notifications.find({userId: "CharlieDalton", questionId: "BinaryQuestion", gameId: "ActiveGame"}).count(), 1);
        })
    });


    it('they won free pickk', function() {
      Meteor.loginWithToken("CharlieDalton");
      return Promise.resolve()
        .then(waitFor(function() {return DDP._allSubscriptionsReady()}))
        .then(denodeify(Tracker.afterFlush))
        .then(denodeify(function(callback) {return Meteor.call("questionAnswered", "BinaryQuestion", "option1", "500", "Will Erik Smith Hit a Home Run in the 6th inning?", callback)}))
        .then(denodeify(function(callback) {return Meteor.call("deactivateStatus", "PitchQuestion", callback)}))
        .then(denodeify(function(callback) {return Meteor.call("modifyBinaryQuestionStatus", "BinaryQuestion", "option1", callback)}))
        .then(function() {
          assert.equal(Notifications.findOne({userId: "CharlieDalton", questionId: "BinaryQuestion"}).message, 'Nice Pickk! "Will Erik Smith Hit a Home Run in the 6th inning?" 2000 Coins!');
        })
    });    

    it('they won normal play', function() {
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

    it('they made a game prediction', function() {
      Meteor.loginWithToken("CharlieDalton");
      return Promise.resolve()
        .then(waitFor(function() {return DDP._allSubscriptionsReady()}))
        .then(denodeify(Tracker.afterFlush))
        .then(denodeify(function(callback) {return Meteor.call("gameQuestionAnswered", "FutureActiveQuestion", "option1", "0", "", callback)}))
        .then(function() {
          assert.equal(Notifications.find({userId: "CharlieDalton", questionId: "FutureActiveQuestion", type: "diamonds"}).count(), 1);
        })
    });

    it('they made won a game prediction', function() {
      Meteor.loginWithToken("CharlieDalton");
      return Promise.resolve()
        .then(waitFor(function() {return DDP._allSubscriptionsReady()}))
        .then(denodeify(Tracker.afterFlush))
        .then(denodeify(function(callback) {return Meteor.call("gameQuestionAnswered", "FutureActiveQuestion", "option1", "0", "", callback)}))
        .then(denodeify(function(callback) {return Meteor.call("deactivateStatus", "FutureActiveQuestion", callback)}))
        .then(denodeify(function(callback) {return Meteor.call("modifyGameQuestionStatus", "FutureActiveQuestion", "option1", callback)}))
        .then(function() {
          assert.equal(Notifications.findOne({userId: "CharlieDalton", questionId: "FutureActiveQuestion", type: "diamonds", value: 10}).message, 'Nice Pickk on Buffalo Bills vs Houston Texans! You Earned 10 Diamonds!');
        })
    });
  })

  describe('other notifications', function() {
    beforeEach(function() {
      // runs before each test in this block
      Meteor.subscribe('userData')
      Meteor.subscribe('activeGames')
      Meteor.subscribe('gamePlayed', "CharlieDalton", "NoOutsGame")
      Meteor.subscribe('unreadNotifications, "CharlieDalton"')
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
        .then(denodeify(function(callback) {return Meteor.call("awardDiamonds", "CharlieDalton", "ActiveGame", 50, callback)}))
        .then(function() {
          assert.equal(Notifications.findOne({userId: "CharlieDalton", type: "diamonds", value: 50}).message, "You Earned 50 Diamonds!");
        })
    });  

    it('they won a trophy', function() {
      Meteor.loginWithToken("CharlieDalton");
      return Promise.resolve()
        .then(waitFor(function() {return DDP._allSubscriptionsReady()}))
        .then(denodeify(Tracker.afterFlush))
        .then(denodeify(function(callback) {return Meteor.call("notifyTrophyAwarded", "xNMMTjKRrqccnPHiZ", "CharlieDalton", "ActiveGame", callback)}))
        .then(function() {
          assert.equal(Notifications.find({userId: "CharlieDalton", type: "trophy", trophyId: "xNMMTjKRrqccnPHiZ"}).count(), 1);
        })
    });    
  })
}
