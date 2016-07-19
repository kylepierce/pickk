Meteor.startup(function() {

  // Not sure what this is.
  AccountsEntry.config({
    defaultProfile: {
      someDefault: 'default'
    }
  });

  // Facebook login 
  ServiceConfiguration.configurations.update(
    {"service": "facebook"}, {
      $set: {
        "appId": Meteor.settings.private.facebook.clientId,
        "secret": Meteor.settings.private.facebook.secret
      }
    }, {upsert: true}
  );

  // Twitter login
  ServiceConfiguration.configurations.update(
    {"service": "twitter"}, {
      $set: {
        "consumerKey": "D3R4rpdKWbzzBoVaJwyg6dFH2",
        "secret": "CXk4WSo5Crb3NU76cp3IuXNfsUhAwmJapq60iZVCTMAp1bBv11"
      }
    }, {upsert: true}
  );

});

