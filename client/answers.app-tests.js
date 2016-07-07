if (Meteor.isClient) {
  var denodeify = function(func) {
    return function() {
      return new Promise(function(resolve, reject) {
        func(function(error) {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
        })
      });
    }
  };

  var waitFor = function(func, timeout, interval) {
    interval = interval || 200;
    timeout = timeout || 1000;
    return function() {
      return new Promise(function(resolve, reject) {
        var start = new Date().getTime();
        var poll = Meteor.setInterval(function() {
          if (func()) {
            clearInterval(poll);
            resolve();
          } else {
            var now = new Date().getTime();
            if (now > start + timeout) {
              clearInterval(poll);
              reject(new Error("Timeout"));
            }
          }
        }, interval);
      });
    }
  };

  beforeEach(function() {
    return Promise.resolve()
      .then(denodeify(function(callback) {return Meteor.call('xolvio:cleaner/resetDatabase', null, callback)}))
      .then(denodeify(function(callback) {return Meteor.call('pickk/populateDatabase', null, callback)}))
  });

  describe('questions & answers', function() {
    it('gives coins for a correct answer', function() {
      Meteor.loginWithToken("CharlieDalton");
      return Promise.resolve()
        .then(waitFor(function() {return DDP._allSubscriptionsReady()}))
        .then(denodeify(Tracker.afterFlush))
        .then(denodeify(function(callback) {return Meteor.call("questionAnswered", "PitchQuestion", "option1", "250", "Strike", callback)}))
        .then(denodeify(function(callback) {return Meteor.call("deactivateStatus", "PitchQuestion", callback)}))
        .then(denodeify(function(callback) {return Meteor.call("modifyQuestionStatus", "PitchQuestion", "option1", callback)}))
        .then(function() {
          assert.equal(Meteor.user().profile.coins, 10275);
        });
    })

    it('does not give coins for an incorrect answer', function() {
      Meteor.loginWithToken("CharlieDalton");
      return Promise.resolve()
        .then(waitFor(function() {return DDP._allSubscriptionsReady()}))
        .then(denodeify(Tracker.afterFlush))
        .then(denodeify(function(callback) {return Meteor.call("questionAnswered", "PitchQuestion", "option3", "500", "Hit", callback)}))
        .then(denodeify(function(callback) {return Meteor.call("deactivateStatus", "PitchQuestion", callback)}))
        .then(denodeify(function(callback) {return Meteor.call("modifyQuestionStatus", "PitchQuestion", "option1", callback)}))
        .then(function() {
          assert.equal(Meteor.user().profile.coins, 9500);
        });
    });
  })
}
