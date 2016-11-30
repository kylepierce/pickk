if (Meteor.isCordova) {
  var deviceReady = false;

  document.addEventListener('deviceready', function () {
    deviceReady = true;
    
    Branch.initSession();
    var data = Session.get("deepLinked");
    var nonBranch = Session.get("nonBranch");
    console.log("third", nonBranch)
    if (nonBranch){
      handleOpenURL(nonBranch);
      Session.set("nonBranch", "");
    }
    console.log("device ready command", data)
  })
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
