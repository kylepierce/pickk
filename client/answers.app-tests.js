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

  var waitForSubscriptions = function() {
    return new Promise(function(resolve, reject) {
      var poll = Meteor.setInterval(function() {
        if (DDP._allSubscriptionsReady()) {
          clearInterval(poll);
          resolve();
        }
      }, 200);
    });
  }

  describe('data available when routed', function() {
    it('renders the body when routed to', function() {
      Meteor.loginWithToken("CharlieDalton");
      return Promise.resolve()
        .then(waitForSubscriptions)
        .then(denodeify(Tracker.afterFlush))
        .then(function() {
          Router.go('/');
        })
        .then(waitForSubscriptions)
        .then(denodeify(Tracker.afterFlush))
        .then(function() {
          console.log(Meteor.user());
          console.log($("body").html().indexOf("What is an outcome of the bat?"));
          assert.equal($('body').length, 1);
        });
    })
  })
}
