Accounts.onCreateUser(function(options, user){

  profile = {coins: 50000}
  
  user.profile = profile 

  return user;
});

Meteor.startup(function () {

  // Not sure what this is.
  // AccountsEntry.config({
  //   defaultProfile: {
  //       someDefault: 'default'
  //   }
  // });

  // Facebook login 
  ServiceConfiguration.configurations.update(
      { "service": "facebook" }, { $set: {"appId": "1399965486969249", "secret": "599da8e423c2d677eda352cde88d01f9"}},{ upsert: true }
    );

  // Twitter login
  ServiceConfiguration.configurations.update(
      { "service": "twitter" }, { $set: { "consumerKey": "D3R4rpdKWbzzBoVaJwyg6dFH2", "secret": "CXk4WSo5Crb3NU76cp3IuXNfsUhAwmJapq60iZVCTMAp1bBv11" } }, { upsert: true }
    );

  // Email sent to user

  // Email sending from
  Accounts.emailTemplates.from = 'Pickk <welcome@pickk.co>';

  // Applications name
  Accounts.emailTemplates.siteName = 'Pickk';

  // Creates subject line of the email.
  Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return 'Confirm Your Email Address';
  };

  // A Function that takes a user object and a url, and returns the body text for the email.
  // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
  Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    return 'click on the following link to verify your email address: ' + url;
  };

});
