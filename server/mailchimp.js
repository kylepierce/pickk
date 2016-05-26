mailChimpLists = new MailChimpLists(Meteor.settings.private.mailchimp.apiKey);

mailChimpLists.subscribeUser = function(user, callback) {
  if (!(user.emails && user.emails.length)) {
    return; // Twitter login
  }
  return this.subscribe({
    id: Meteor.settings.private.mailchimp.listId,
    email: {
      email: user.emails[0].address
    },
    merge_vars: {
      FNAME: user.profile.firstName,
      LNAME: user.profile.lastName,
      UNAME: user.profile.username
    },
    update_existing: true
  }, callback);
}
