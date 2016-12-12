if (Meteor.isCordova) {
  var deviceReady = false;

  document.addEventListener('deviceready', function () {
    deviceReady = true;
    console.log("Device is ready");
    if (Meteor.user()) initIntercom();
  }, false);

  Accounts.onLogin(function () {
    console.log("User is logged in");

    if (deviceReady) initIntercom();
  });

  updateIntercom = function (data) {
    var type = typeof data
    console.log("type", type)
    console.log("before", data)
    var data = JSON.stringify(data)
    console.log("after", data)
    var objKeysRegex = /({|,)(?:\s*)(?:')?([A-Za-z_$\.][A-Za-z0-9_ \-\.$]*)(?:')?(?:\s*):/g;// look for object names
    var newQuotedKeysString = data.replace(objKeysRegex, "$1\"$2\":");// all object names should be double quoted
    var newObject = JSON.parse(newQuotedKeysString);
    console.log("final", newObject)
    intercom.updateUser(newObject);
  }

  initIntercom = function () {
    var user = Meteor.user();
    // Grab deep link data if available
    var data = Session.get("deepLinked");
    if (!data){
      var data = {};
    }
    data.userId = user._id;
    if (user.emails && user.emails[0] && user.emails[0].address) {
      data.email = user.emails[0].address;
    }
    if (user.profile && user.profile.firstName && user.profile.lastName) {
      data.name = user.profile.firstName + " " + user.profile.lastName;
    }

    intercom.registerIdentifiedUser(data);
    intercom.updateUser(data);
    console.log("Connection with Intercom has been established");
    if (data.userId) console.log("User ID", data.userId);
    if (data.email) console.log("Email", data.email);
    if (data.name) console.log("Name", data.name);

    intercom.setLauncherVisibility(intercom.GONE);
  };

  enableIntercomNotifications = function () {
    intercom.registerForPush();
    console.log("Intercom notifications is allowed");
  };
}
