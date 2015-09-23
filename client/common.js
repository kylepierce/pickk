Push.allow({
    send: function(userId, notification) {
      // Allow all users to send to everybody - For test only!
      return true;
    }
  });

Push.addListener('token', function(token) {
  return console.log('token received: ' + JSON.stringify(token));
});

if (Meteor.isServer) {
  Meteor.startup(function () {
    Push.debug=true;
  });
}