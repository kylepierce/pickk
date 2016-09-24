// if (Meteor.isCordova) {
//   var deviceReady = false;

//   document.addEventListener('deviceready', function () {
//     deviceReady = true;
//     console.log("Device is ready");

//     if (Meteor.userId()) initIntercom();
//   }, false);

//   Accounts.onLogin(function () {
//     console.log("User is logged in");

//     if (deviceReady) initIntercom();
//   });

//   initIntercom = function () {
//     var user = Meteor.user();

//     var data = {};
//     data.userId = user._id;
//     if (user.emails && user.emails[0] && user.emails[0].address) {
//       data.email = user.emails[0].address;
//     }
//     if (user.profile && user.profile.firstName && user.profile.lastName) {
//       data.name = user.profile.firstName + " " + user.profile.lastName;
//     }

//     intercom.registerIdentifiedUser(data);
//     intercom.updateUser(data);
//     console.log("Connection with Intercom has been established (userId=" + data.userId + "), email(" + data.email + "), name(" + data.name + ")");

//     enableIntercomNotifications();
//   };

//   enableIntercomNotifications = function () {
//     intercom.registerForPush();
//     console.log("Intercom notifications is allowed");
//   };
// }
