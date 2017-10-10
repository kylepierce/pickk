Meteor.startup(function() {
  if (Meteor.isDevelopment) {
    // Will use localhost
    process.env.MAIL_URL = "smtp://postmaster%40mg.pickk.co:2e53ee0dce2deade7b63443c39322243@smtp.mailgun.org:587"

    //  "smtp://testinglocal%40sandboxc2f7a352a27342c88211b75114d396cc.mailgun.org:12345678@smtp.mailgun.org:587"
  } else {
    process.env.MAIL_URL = "smtp://postmaster%40mg.pickk.co:2e53ee0dce2deade7b63443c39322243@smtp.mailgun.org:587"
  }

});

console.log(Accounts);

Accounts.emailTemplates.siteName = "Pickk"
Accounts.emailTemplates.from = "Pickk App <hi@pickk.co>";

Accounts.emailTemplates.resetPassword = {
  subject(user) {
    return "Reset your password on Meteor Todos";
  },
  text(user, url) {
    return `Hello!
Click the link below to reset your password on Pickk.
${url}
If you didn't request this email, please ignore it.
Thanks,
`
  },
  html(user, url) {
    // This is where HTML email content would go.
    // See the section about html emails below.
  }
};

Accounts.emailTemplates.enrollAccount = {
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
    // This is where HTML email content would go.
    // See the section about html emails below.
  }
};
