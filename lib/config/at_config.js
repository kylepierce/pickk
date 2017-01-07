var mySubmitFunc = function(error, state){
  var currentUser = Accounts.user()

  if (!error) {
    IonKeyboard.close()
    if (state == "signIn") {
      // Successfully logged in
      var currentUser = Meteor.userId();
      console.log("sign in", currentUser);
      if (Meteor.isCordova) {
        Branch.setIdentity(currentUser);
        var eventName = 'signed_in';
        Branch.userCompletedAction(eventName)
      }
    }
    if (state == "signUp") {
      var email = Meteor.user() && Meteor.user().emails
      var userId = Meteor.userId()
      console.log("sign up",userId);
      var twitter = Meteor.user().services && Meteor.user().services.twitter;

      if(email){
        analytics.track("newUserCreated", {
          id: userId,
          signUpWith: "email"
        });
        Router.go('/newUserSettings');
      } else if (twitter) {
        var username = twitter.screenName
        Meteor.call('updateProfile', username);
        analytics.track("newUserCreated", {
          id: userId,
          signUpWith: "twitter"
        });
        Router.go('/newUserSettings');
      } else {
        analytics.track("newUserCreated", {
          id: userId,
          signUpWith: "facebook"
        });
        Router.go('/newUserSettings');
      }

      var identify = Session.get("identify");
      analytics.identify(userId, identify);

      if (Meteor.isCordova) {
        Branch.setIdentity(userId)
        var eventName = 'signed_up';
        Branch.userCompletedAction(eventName)
      }
    }
  }
};

var myLogoutFunc = function(error, state){
  if (!error) {
    if (state === "signIn") {
      // Successfully logged in
      // ...
    }
    if (state === "signUp") {
      // Successfully registered
      // ...
    }
  }
};

AccountsTemplates.configure({
    // Behaviour
    confirmPassword: false,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    //sendVerificationEmail: true,
    lowercaseUsername: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: true,
    showLabels: true,
    showPlaceholders: true,
    showResendVerificationEmailLink: true,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,
    showReCaptcha: false,

    // Privacy Policy and Terms of Use
    privacyUrl: '/privacy',
    termsUrl: '/terms-of-use',

    // Redirects
    homeRoutePath: '/',
    redirectTimeout: 4000,

    // Hooks
    onLogoutHook: myLogoutFunc,
    onSubmitHook: mySubmitFunc,

    // Texts
    texts: {
      button: {
          signUp: "Join!"
      },
      socialSignUp: "Register",
      socialIcons: {
          facebook: "fa fa-facebook-square",
          twitter: "fa fa-twitter-square"
      },
      title: {
          forgotPwd: "Recover Your Password"
      },
    },
});


AccountsTemplates.configureRoute('signIn', {
    name: 'signIn',
    path: '/login',
    template: 'userAccounts',
    layoutTemplate: 'loginLayout',
    redirect: '/push-active',
});

AccountsTemplates.configureRoute('signUp', {
    name: 'signUp',
    path: '/register',
    template: 'register',
    layoutTemplate: 'loginLayout',
    redirect: '/newUserSettings',
});

AccountsTemplates.configureRoute('forgotPwd', {
    name: 'recover-password',
    path: '/recover-password',
    template: 'forgotPassword',
    layoutTemplate: 'loginLayout',
    redirect: '/landing',
});

AccountsTemplates.configureRoute('resetPwd', {
    layoutTemplate: 'loginLayout',
    name: 'reset-password',
    path: '/reset-password',
    template: 'newPassword',
    redirect: '/newUserSettings',
});

AccountsTemplates.configureRoute('verifyEmail', {
    name: 'verify-email',
    path: '/verify-email',
    template: 'verifyEmail',
    layoutTemplate: 'loginLayout',
    redirect: '/',
});
