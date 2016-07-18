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

  // How did the user sign up?
  var currentUser = user._id
  if(user.services && user.services.twitter){
    var signUpWith = "twitter"
  } else if (user.services && user.services.facebook) {
    var signUpWith = "facebook"
  } else {
    var signUpWith = "email"
  }
  analytics.track("newUserCreated", {
    id: currentUser,
    signUpWith: signUpWith
  });

  user.pendingNotifications = [];
  if (user.services && user.services.twitter && user.services.twitter.screenName) {
    user.profile.username = user.services && user.services.twitter && user.services.twitter.screenName;
  }
  user.profile.firstName = user.services && user.services.facebook && user.services.facebook.first_name || '';
  user.profile.lastName = user.services && user.services.facebook && user.services.facebook.last_name || '';
  mailChimpLists.subscribeUser(user);
  return user;
});
