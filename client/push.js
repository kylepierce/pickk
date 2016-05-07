// var errorHandler, onNotification, pushNotification, successHandler, tokenHandler;

// pushNotification = void 0;

// Meteor.startup(function() {
//   var err, txt;
//   if (Meteor.isCordova) {
//     console.log('startup event received');
//     try {
//       pushNotification = window.plugins.pushNotification;
//       console.log('registering ' + device.platform);
//       if (device.platform === 'android' || device.platform === 'Android' || device.platform === 'amazon-fireos') {

//       } else {
//         pushNotification.register(tokenHandler, errorHandler, {
//           'badge': 'true',
//           'sound': 'true',
//           'alert': 'true',
//           'ecb': 'onNotificationAPN'
//         });
//       }
//     } catch (_error) {
//       err = _error;
//       txt = 'There was an error on this page.\n\n';
//       txt += 'Error description: ' + err.message + '\n\n';
//       alert(txt);
//     }
//   }
// });

// window.onNotificationAPN = function(e) {
//   if (e.alert) {
//     console.log('push-notification: ' + e.alert);
//   }
//   if (e.badge) {
//     pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
//   }
// };

// onNotification = function(e) {
//   console.log('EVENT -> RECEIVED:' + e.event);
//   switch (e.event) {
//     case 'registered':
//       if (e.regid.length > 0) {
//         console.log('REGISTERED -> REGID:' + e.regid);
//         console.log('regID = ' + e.regid);
//       }
//       break;
//     case 'message':
//       if (e.foreground) {
//         console.log('INLINE NOTIFICATION--');
//       } else {
//         if (e.coldstart) {
//           console.log('--COLDSTART NOTIFICATION--');
//         } else {
//           console.log('--BACKGROUND NOTIFICATION--');
//         }
//       }
//       console.log('MESSAGE -> MSG: ' + e.payload.message);
//       console.log('MESSAGE -> MSGCNT: ' + e.payload.msgcnt);
//       console.log('MESSAGE -> TIMESTAMP: ' + e.payload.timeStamp);
//       break;
//     case 'error':
//       console.log('ERROR -> MSG:' + e.msg);
//       break;
//     default:
//       console.log('EVENT -> Unknown, an event was received and we do not know what it is');
//       break;
//   }
// };

// tokenHandler = function(result) {
//   console.log('[NOTIFICATIONS] token: ' + result);
// };

// successHandler = function(result) {
//   console.log('[NOTIFICATIONS] success:' + result);
// };

// errorHandler = function(error) {
//   console.log('[NOTIFICATIONS] error:' + error);
// };
