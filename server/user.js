Accounts.onCreateUser(function(options, user){
  secret = {
      rightCount: 00,
      wrongCount: 00
  };

  user.secret = secret;

  return user;
});
