if (Meteor.isClient) {
  denodeify = function(func) {
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

  waitFor = function(func, timeout, interval) {
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
}
