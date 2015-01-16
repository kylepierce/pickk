Accounts.onCreateUser(function(options, user){
  secret = {
      coins: 50000,
  };

  user.secret = secret;


  return user;
});

  Meteor.startup(function () {
    AccountsEntry.config({
      defaultProfile: {
          someDefault: 'default'
      }
    });
  });
