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

Meteor.startup(function () {
    sAlert.config({
        effect: 'stackslide',
        position: 'bottom',
        timeout: 5000,
        html: false,
        onRouteClose: true,
        stack: true,
        // or you can pass an object:
        // stack: {
        //     spacing: 10 // in px
        //     limit: 3 // when fourth alert appears all previous ones are cleared
        // }
        offset: 50, // in px - will be added to first alert (bottom or top - depends of the position in config)
        beep: false
        // examples:
        // beep: '/beep.mp3'  // or you can pass an object:
        // beep: {
        //     info: '/beep-info.mp3',
        //     error: '/beep-error.mp3',
        //     success: '/beep-success.mp3',
        //     warning: '/beep-warning.mp3'
        // }
    });

});