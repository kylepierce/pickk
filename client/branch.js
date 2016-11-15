

if (Meteor.isCordova) {
  var deviceReady = false;

  DeepLinkHandler = function (data) {
    if (data) {
      console.log('Data from deep link: ' + JSON.stringify(data));
    } else {
      console.log('No data found');
    }
  } 

  document.addEventListener('deviceready', function () {
    deviceReady = true;
    Branch.setDebug(true);
    console.log("Device is Purple");

    var latest = Branch.initSession();
    console.log("latest", latest)
    Branch.getFirstReferringParams().then(function (res) {
      // Success Callback
      console.log("tried", res);
    }, function (err) {
      // Error Callback
      console.error("failed", err);
    });
    // if (Meteor.user()) initIntercom();
  }, false);
}
  // Accounts.onLogin(function () {
  //   console.log("User is logged in");

  //   if (deviceReady) initIntercom();
  // });

  // initIntercom = function () {
  //   var user = Meteor.user();

  //   var data = {};
  //   data.userId = user._id;
  //   if (user.emails && user.emails[0] && user.emails[0].address) {
  //     data.email = user.emails[0].address;
  //   }
  //   if (user.profile && user.profile.firstName && user.profile.lastName) {
  //     data.name = user.profile.firstName + " " + user.profile.lastName;
  //   }

  //   intercom.registerIdentifiedUser(data);
  //   intercom.updateUser(data);
  //   console.log("Connection with Intercom has been established");
  //   if (data.userId) console.log("User ID", data.userId);
  //   if (data.email) console.log("Email", data.email);
  //   if (data.name) console.log("Name", data.name);

  //   intercom.setLauncherVisibility(intercom.GONE);

  //   enableIntercomNotifications();
  // };

  // enableIntercomNotifications = function () {
  //   intercom.registerForPush();
  //   console.log("Intercom notifications is allowed");
  // };
