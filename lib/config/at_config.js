var mySubmitFunc = function(error, state){
//   // console.log( state );
//  var email = Meteor.user().emails[0].address;
//  console.log( email );
 
//  if ( email ) {
//   Meteor.call( 'addToMailingList', email, function( error ) {
//     if ( error ) {
//       console.log( error.reason );
//     }
//   });
//  }

  if (!error) {
    if (state === "signIn") {
      // Successfully logged in
      console.log('signed in')
    }
    if (state === "signUp") {
      var currentUser = Meteor.user();
      var email = Meteor.user().emails[0].address;
      // var twitter = currentUser.services.twitter
      if(email){
        Meteor.call( 'addToMailingList', email, function( error ) {
          if ( error ) {
            console.log( error.reason );
            return
          }
        });
        Router.go('/newUserSettings');
      } else if (twitter) {
        var username = twitter.screenName
        Meteor.call('updateProfile', currentUser, username);
      } else {
        console.log()
        Router.go('/newUserSettings');
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
    confirmPassword: true,
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
    homeRoutePath: '/dashboard',
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
    redirect: '/',
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