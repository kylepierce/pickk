Accounts.onCreateUser(function(options, user){
  profile = {
      questionsAnswered: [],
      rightCount: 0,
      wrongCount: 0
  };

  user.profile = profile

  return user;
});