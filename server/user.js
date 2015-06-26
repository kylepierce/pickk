Accounts.onCreateUser(function(options, user){

	profile = {
		coins: 50000,
    avatar: 'twitter_logo.png',
    followers: [],
    badges: [],
    trophies: [],
    groups: [],
    firstName: '',
    lastName: ''
    }
    user.profile = profile 


  return user;
});

Meteor.startup(function () {

  // Not sure what this is.
  AccountsEntry.config({
    defaultProfile: {
        someDefault: 'default'
    }
  });

  // Facebook login 
  ServiceConfiguration.configurations.update(
      { "service": "facebook" }, { $set: {"appId": "1399965486969249", "secret": "599da8e423c2d677eda352cde88d01f9"}},{ upsert: true }
    );

  // Twitter login
  ServiceConfiguration.configurations.update(
      { "service": "twitter" }, { $set: { "consumerKey": "D3R4rpdKWbzzBoVaJwyg6dFH2", "secret": "CXk4WSo5Crb3NU76cp3IuXNfsUhAwmJapq60iZVCTMAp1bBv11" } }, { upsert: true }
    );

});

