mailChimpLists = new MailChimpLists(Meteor.settings.private.mailchimp.apiKey);

mailChimpLists.subscribeUser = function(user, defaults, callback) {
  var email;
  if (user.emails && user.emails.length && user.emails[0].address) {
    email = user.emails[0].address;
  } else if (user.services && user.services.facebook && user.services.facebook.email) {
    email = user.services.facebook.email;
  }
  if (!email) {
    return; // Twitter login
  }
  if (email.match(/@example\.com$/)) {
    return; // Fixture user
  }

  var merge_vars = {
    FNAME: user.profile.firstName,
    LNAME: user.profile.lastName,
    UNAME: user.profile.username,
    ROLE: user.profile.role,
  }

  if (user.profile.favoriteTeams) {
    var teamCount = 1;
    user.profile.favoriteTeams.forEach(function (team) {
      merge_vars['FAV_TEAM' + teamCount] = team;
      teamCount++;
    });
  }

  return this.subscribe(_.defaults({
    id: Meteor.settings.private.mailchimp.listId,
    email: {
      email: email
    },
    merge_vars: merge_vars,
    update_existing: true
  }, defaults), callback);
};
