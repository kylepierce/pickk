var checkUserLoggedIn, userAuthenticatedAdmin, userAuthenticatedBetaTester;

checkUserLoggedIn = function() {
  if (!Meteor.loggingIn() && !Meteor.user()) {
    return Router.go('/landing');
  } else {
    return this.next();
  }
};

// userAuthenticatedBetaTester = function() {
//   var isBetaTester, loggedInUser;
//   loggedInUser = Meteor.user();
//   isBetaTester = Roles.userIsInRole(loggedInUser, ['tester']);
//   if (!Meteor.loggingIn() && isBetaTester) {
//     return Router.go('/dashboard');
//   } else {
//     return this.next();
//   }
// };

// userAuthenticatedAdmin = function() {
//   var isAdmin, loggedInUser;
//   loggedInUser = Meteor.user();
//   isAdmin = Roles.userIsInRole(loggedInUser, ['admin']);
//   if (!Meteor.loggingIn() && isAdmin) {
//     return Router.go('/invites');
//   } else {
//     return this.next();
//   }
// };


Router.onBeforeAction(checkUserLoggedIn, {
  except: ['/', 'landing', 'signUp', 'signIn', 'recover-password', 'reset-password', 'reset-password/:token', 'privacy', 'terms-of-use']
});

// Router.onBeforeAction(userAuthenticatedBetaTester, {
//   only: ['index', 'register', 'login', 'recover-password', 'reset-password', 'privacy', 'terms-of-use', 'notifications', 'dashboard', 'leaderboard', 'groups', 'settings', 'user-profile/:_id', 'groups/:_id', 'searchUsers', 'searchGroups', 'inviteToGroup', 'newgroup', 'groups']
// });

// Router.onBeforeAction(userAuthenticatedAdmin, {
//   only: ['index', 'signup', 'signup/:token', 'login', 'recover-password', 'reset-password']
// });