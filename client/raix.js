Meteor.startup(function () {
  Accounts.onLogin(function () {

    var pushId = Push.id(); // Unified application id - not a token
    var pushStatus = Push.enabled()
    // Push.debug = true;
    var user = Meteor.user()
    console.log(pushId, pushStatus, user)
    if (Meteor.isCordova) {
      if(user.profile.isOnboarded){
        Router.go('/push-active');
      } 
    }
  });
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