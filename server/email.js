Meteor.startup(function() {
  if (Meteor.isDevelopment) {
    // Will use localhost
    process.env.MAIL_URL = "smtp://postmaster%40mg.pickk.co:2e53ee0dce2deade7b63443c39322243@smtp.mailgun.org:587"

    //  "smtp://testinglocal%40sandboxc2f7a352a27342c88211b75114d396cc.mailgun.org:12345678@smtp.mailgun.org:587"
  } else {
    process.env.MAIL_URL = "smtp://postmaster%40mg.pickk.co:2e53ee0dce2deade7b63443c39322243@smtp.mailgun.org:587"
  }
  // Accounts.urls.resetPassword = function (token) {
  //   return 'pickk://reset-password/' + token;
  // };
});

Accounts.emailTemplates.siteName = "Pickk"
Accounts.emailTemplates.from = "Pickk App <hi@pickk.co>";

Accounts.emailTemplates.resetPassword = {
  subject(user) {
    return "Reset your password on Pickk!";
  },
  text(user, url) {
    return 
`Forget your password? Click the link below to change the password.

${url}

You received this email because you just requested a password reset. If you did not request a password reset you can ignore this message.
If you have any questions, just reply to this email! We're always happy to help out.

Cheers,
The Pickk Team
`
  },
  html(user, url) {
    return Handlebars.templates['core']({ 
      headline: "Forget your password?", 
      preheader: "Steps to reset your password",
      copyAbove: "Click the button below to change the password.",
      buttonText: "Reset Password",
      copyBelow: "If you have any questions, just reply to this email! We're always happy to help out.",
      reason: "You received this email because you just requested a password reset. If you did not request a password reset you can ignore this message.",
      url: url 
    });
  }
};

Accounts.emailTemplates.enrollAccount = {
  subject(user) {
    return "Good Call!";
  },
  text(user, url) {
    return `Hello!
Click the link below to Verify your email on Pickk.
${url}
`
  },
  html(user, url) {
    return Handlebars.templates['core']({
      headline: "Verify Pickk",
      preheader: "Thanks for joining Pickk! Pickk is the best way to watch live sports and play with friends. For a chance to win prizes you must have a valid email.",
      copyAbove: "Click the button below to verify this email account.",
      buttonText: "Verify",
      copyBelow: "If you have any questions, just reply to this email! We're always happy to help out.",
      reason: "You received this email because you created an account in the app.",
      url: url
    });
  }
};

Accounts.emailTemplates.verifyEmail = {
  subject(user) {
    return "Verify Your Email";
  },
  text(user, url) {
    return `Hello!
Click the link below to Verify your email on Pickk.
${url}
`
  },
  html(user, url) {
    return Handlebars.templates['core']({
      headline: "Verfiy Email",
      preheader: "For a chance to win prizes you must have a valid email.",
      copyAbove: "Click the button below to verify this email account.",
      buttonText: "Verify",
      copyBelow: "If you have any questions, just reply to this email! We're always happy to help out.",
      reason: "You received this email because you just requested a email verification.",
      url: url
    });
  }
};
