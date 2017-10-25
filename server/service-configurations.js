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
        "consumerKey": Meteor.settings.private.twitter.key,
        "secret": Meteor.settings.private.twitter.secret
      }
    }, {upsert: true}
  );

});

