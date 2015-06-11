var mySubmitFunc = function(error, state){
  if (!error) {
    if (state === "signIn") {
      // Successfully logged in
      console.log("Logged in!")
    }
    if (state === "signUp") {

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
    redirect: '/settings',
});

AccountsTemplates.addField({
    _id: 'username',
    type: 'text',
    required: true,
});

AccountsTemplates.configure({
    // Behaviour
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    sendVerificationEmail: false,
    lowercaseUsername: false,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: false,
    showLabels: true,
    showPlaceholders: true,
    showResendVerificationEmailLink: false,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    privacyUrl: 'privacy',
    termsUrl: 'terms-of-use',

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