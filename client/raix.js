Meteor.startup(function () {
  Accounts.onLogin(function () {
    Push.debug = true;

    Push.Configure({
      android: {
        senderID: 259263435947,
        alert: true,
        badge: true,
        sound: true,
        vibrate: true,
        clearNotifications: true,
        sendInterval: 250
        // icon: '',
        // iconColor: ''
      },
      ios: {
        alert: true,
        clearBadge: true,
        badge: true,
        sound: true,
        sendInterval: 250
      }
    });
  });
});
