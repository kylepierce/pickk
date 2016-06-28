

Template.registerHelper('username', function (user) {
  return this.profile.username
});

Template.registerHelper('isMobile', function () {
  return Meteor.isCordova;
});
