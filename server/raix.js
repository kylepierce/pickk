// Meteor.startup(function () {
// });

var config = {
  sound: true,
  badge: true,
  alert: true,
  vibrate: true,
  sendBatchSize: 1,
  gcm: {
    apiKey: 'AIzaSyAgLfoXtW0MQ0gPOYZJxv2J-BqKm0wlc4Q',
    projectNumber: 259263435947,
    sendInterval: 250
  }
};

Push.debug = true;

if (Meteor.settings.public.isDebug) {

  _.extend(config, {
    apn: {
      certData: Assets.getText('cert/pickk-dev-cert.pem'),
      keyData: Assets.getText('cert/pickk-dev-key.pem'),
      production: false,
      sendInterval: 250,
      passphrase: 'Imlikeacat1991!',
    }
  });
} else {
  _.extend(config, {
    apn: {
      certData: Assets.getText('cert/pickk-prod-cert.pem'),
      keyData: Assets.getText('cert/pickk-prod-key.pem'),
      production: true,
      sendInterval: 250,
      passphrase: 'Imlikeacat1991!',
      gateway: 'gateway.push.apple.com',
    }
  });
}

Push.Configure(config);

var handlePushPayload = function(payload) {
  if (!payload) return;
  if (payload.deeplink_path === true) {
    // Do something within your framework
    Router.go(payload.path)
  }
};

// Called when message recieved on startup (cold+warm)
Push.addListener('startup', function(notification) {
  handlePushPayload(notification.payload);
});
