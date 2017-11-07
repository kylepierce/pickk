if (Meteor.isCordova) {
  document.addEventListener('deviceready', function () {
    var options = {
      devKey: Meteor.settings.public.appsFlyer.key,
      appId: '995393750',
      isDebug: false,
      onInstallConversionDataListener: true
    };
    window.plugins.appsFlyer.initSdk(options, onSuccess, onError);
  })
}
