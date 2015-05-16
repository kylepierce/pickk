Accounts.onCreateUser(function(options, user){

	profile = {
		coins: 50000
    }
    user.profile = profile 

  return user;
});

  Meteor.startup(function () {
    AccountsEntry.config({
      defaultProfile: {
          someDefault: 'default'
      }
    });
  });
