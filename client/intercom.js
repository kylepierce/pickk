document.addEventListener('deviceready', function () {
  Meteor.startup(function () {
    Accounts.onLogin(function() {
      initIntercom();
      enableIntercomNotifications();
    });
  });
}, false);

initIntercom = function () {
  var user = Meteor.user();

  var data = {};
  data.userId = user._id;
  if (user.emails && user.emails[0] && user.emails[0].address) {
    data.email = user.emails[0].address;
  }
  if (user.profile && user.profile.firstName && user.profile.lastName) {
    data.name = user.profile.firstName + " " + user.profile.lastName;
  }

  intercom.registerIdentifiedUser(data);
  intercom.updateUser(data);
  console.log("Connections with Intercom has been established", data);
};

enableIntercomNotifications = function () {
  intercom.registerForPush();
  console.log("Intercom notifications is allowed");
};
