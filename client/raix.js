Meteor.startup(function () {
  Accounts.onLogin(function () {
    if (Meteor.isCordova) {
      PushNotification.hasPermission(function(data) {
        if(user.profile.isOnboarded && !data.isEnabled){
          Router.go('/push-active');
        }
      })
    }
  });
});

Push.debug = true;

Push.allow({
   send: function(userId, notification) {
     return true;
   }
 });


enablePush = function (){
  Push.Configure({
    android: {
      senderID: 259263435947,
      alert: true,
      badge: true,
      sound: true,
      vibrate: true,
      clearNotifications: true,
      // icon: '',
      // iconColor: ''
    },
    ios: {
      alert: true,
      clearBadge: true,
      badge: true,
      sound: true,
    }
  });
}
