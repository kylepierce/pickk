Accounts.onCreateUser(function(options, user) {
  user.profile = {
    coins: 10000,
    avatar: null,
    followers: [],
    following: [],
    badges: [],
    trophies: [],
    groups: [],
    firstName: '',
    lastName: '',
    isOnboarded: false
  };

  user.pendingNotifications = [];
  if (user.services && user.services.twitter && user.services.twitter.screenName) {
    user.profile.username = user.services && user.services.twitter && user.services.twitter.screenName;
  }
  user.profile.firstName = user.services && user.services.facebook && user.services.facebook.first_name || '';
  user.profile.lastName = user.services && user.services.facebook && user.services.facebook.last_name || '';
  mailChimpLists.subscribeUser(user);
  return user;
});
