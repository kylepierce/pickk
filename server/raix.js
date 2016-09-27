Meteor.startup(function () {
  var config = {
    gcm: {
      apiKey: 'xxxxxxx'
    }
  };

  if (Meteor.settings.public.isDebug) {
    Push.debug = true;

    _.extend(config, {
      apn: {
        certData: Assets.getText('cert/apnDevCert.pem'),
        keyData: Assets.getText('cert/apnDevKey.pem'),
        production: false
        //passphrase: 'xxxxxxxxx',
        //gateway: 'gateway.push.apple.com',
      }
    });
  } else {
    _.extend(config, {
      apn: {
        certData: Assets.getText('cert/apnCert.pem'),
        keyData: Assets.getText('cert/apnKey.pem'),
        production: true
        //passphrase: 'xxxxxxxxx',
        //gateway: 'gateway.push.apple.com',
      }
    });
  }

  Push.Configure(config);
});
