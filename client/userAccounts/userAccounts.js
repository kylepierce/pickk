Template.userAccounts.events({
  'click #at-facebook': function(){
    analytics.track('Click Social Login', {
      type: "facebook"
    });
  },
  'click #at-twitter': function () {
    analytics.track('Click Social Login', {
      type: "twitter"
    });
  },
  'click #at-field-email': function () {
    analytics.track('Click Email Input', {
      location: "Sign In"
    });
  },
  'click #at-field-password': function () {
    analytics.track('Click Password Field', {
      location: "Sign In"
    });
  },
  'click #at-forgotPwd': function(){
    analytics.track('Click "Forgot Your Password" Link');
  },
  'click #at-signUp': function () {
    analytics.track('Click "Register" Link');
  },
  'click #at-resend-verification-email': function(){
    analytics.track('Click "Send Again" Link');
  }, 
  'click #at-btn': function () {
    analytics.track('Click Sign In Button');
  }, 
});

Template.register.events({
  'click #at-facebook': function () {
    analytics.track('Click Social Register', {
      type: "facebook"
    });
  },
  'click #at-twitter': function () {
    analytics.track('Click Social Register', {
      type: "twitter"
    });
  },
  'click #at-field-email': function () {
    analytics.track('Click Email Input', {
      location: "Register"
    });
  },
  'click #at-field-password': function () {
    analytics.track('Click Password Field', {
      location: "Register"
    });
  },
  'click #at-signIn': function () {
    analytics.track('Click "Sign In" Link');
  },
  'click #at-btn': function () {
    analytics.track('Click Register Button');
  }, 
});

Template.forgotPassword.events({
  'click #at-field-email': function () {
    analytics.track('Click Email Input', {
      location: "Register"
    });
  },
  'click #at-signUp': function () {
    analytics.track('Click "Register" Link');
  },
  'click #at-resend-verification-email': function () {
    analytics.track('Click "Send Again" Link');
  },
  'click #at-btn': function () {
    analytics.track('Click Reset Password Button');
  },
});