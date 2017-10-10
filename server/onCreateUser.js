Accounts.onCreateUser(function(options, user) {
  user.profile = {
    avatar: null,
    followers: [],
    following: [],
    badges: [],
    trophies: [],
    firstName: '',
    lastName: '',
    isOnboarded: false
  };

  if (user.services && user.services.twitter && user.services.twitter.screenName) {
    user.profile.username = user.services && user.services.twitter && user.services.twitter.screenName;
  }
  user.profile.firstName = user.services && user.services.facebook && user.services.facebook.first_name || '';
  user.profile.lastName = user.services && user.services.facebook && user.services.facebook.last_name || '';

  return user;
});
