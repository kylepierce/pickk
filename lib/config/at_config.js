var mySubmitFunc = function(error, state){
  if (!error) {
    if (state === "signIn") {
      // Successfully logged in
    }
    if (state === "signUp") {
      Router.go('/newUserSettings');
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
    sendVerificationEmail: true,
    lowercaseUsername: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: true,
    showLabels: true,
    showPlaceholders: true,
    showResendVerificationEmailLink: true,

    // Client-side Validation
    continuousValidation: true,
    negativeFeedback: true,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

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
    name: 'reset-password',
    path: '/reset-password',
    template: 'newPassword',
    layoutTemplate: 'loginLayout',
    redirect: '/newUserSettings',
});

// AccountsTemplates.configureRoute('showForgotPasswordLink', {
//     name: 'showForgotPasswordLink',
//     path: '/reset-password/:token',
//     template: 'newPassword',
//     layoutTemplate: 'loginLayout',
//     redirect: '/newUserSettings',
// });


// Email

// Accounts.emailTemplates.from = "welcome@pickk.co"
// Accounts.emailTemplates.siteName = "Pickk"

// Accounts.emailTemplates.verifyEmail.subject = function(user) {
//   return 'Confirm your Email Address'
// }
// Accounts.emailTemplates.verifyEmail.text = function(user, url) {
//   return 'Thanks for signing up for Pickk! Please Click on the following link to verify your email! ' + url
// }




