Meteor.startup(function () {
  var config = {
    gcm: {
      apiKey: 'AIzaSyAgLfoXtW0MQ0gPOYZJxv2J-BqKm0wlc4Q',
      projectNumber: 259263435947,
      sendInterval: 250
    }
  };

  if (Meteor.settings.public.isDebug) {
    // Push.debug = true;

    _.extend(config, {
      apn: {
        certData: Assets.getText('cert/apnCert.pem'),
        keyData: Assets.getText('cert/apnKey.pem'),
        production: false,
        sendInterval: 250
        //passphrase: 'xxxxxxxxx',
        //gateway: 'gateway.push.apple.com',
      }
    });
  } else {
    _.extend(config, {
      apn: {
        certData: Assets.getText('cert/apnCert.pem'),
        keyData: Assets.getText('cert/apnKey.pem'),
        production: true,
        sendInterval: 250
        //passphrase: 'xxxxxxxxx',
        //gateway: 'gateway.push.apple.com',
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
});
