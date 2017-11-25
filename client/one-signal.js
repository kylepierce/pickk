if (Meteor.isCordova) {
  document.addEventListener('deviceready', function () {
    // Enable to debug issues.
    // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

    var notificationOpenedCallback = function (jsonData) {
      analytics.track("open push notification", {
        userId: Meteor.userId(),
        notificationId: jsonData.notification.payload.notificationID,
        isAppInFocus: jsonData.notification.payload.isAppInFocus,
        payload: jsonData.notification.payload
      });

      DeepLinkHandler(jsonData.notification.payload.additionalData);
    };

    window.plugins.OneSignal
      .startInit("a8f56326-5d84-11e5-bbc5-8f454b01b190")
      .iOSSettings({"kOSSettingsKeyAutoPrompt": false})
      .inFocusDisplaying("None")
      .handleNotificationOpened(notificationOpenedCallback)
      .endInit();

    // Call syncHashedEmail anywhere in your app if you have the user's email.
    // This improves the effectiveness of OneSignal's "best-time" notification scheduling feature.
    // window.plugins.OneSignal.syncHashedEmail(userEmail);
  }, false);
}