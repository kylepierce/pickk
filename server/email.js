Meteor.startup(function() {
  if (Meteor.isDevelopment) {
    // Will use localhost 
    process.env.MAIL_URL = "smtp://testinglocal%40sandboxc2f7a352a27342c88211b75114d396cc.mailgun.org:12345678@smtp.mailgun.org:587"
  } else {
    process.env.MAIL_URL = "smtp://postmaster%40mg.pickk.co:2e53ee0dce2deade7b63443c39322243@smtp.mailgun.org:587"
  }

  PrettyEmail.defaults.resetPassword = {
     heading: Meteor.settings.private.emailText.forgotPwdHeading,
     message: Meteor.settings.private.emailText.forgotPwdMessage,
     buttonText: Meteor.settings.private.emailText.forgotPwdButton,
  }
    
});

// PrettyEmail.options = {
//   from: 'Pickk <welcome@pickk.co>',
//   logoUrl: 'http://pickk.co/img/twitter_logo.png',
//   companyName: 'Pickk',
//   companyUrl: 'http://pickk.co',
//   companyAddress: '1759 NE 39th CT Pompano Beach, FL 33064',
//   companyTelephone: '+14022508998',
//   companyEmail: 'welcome@pickk.co',
//   siteName: 'Pickk'
// }