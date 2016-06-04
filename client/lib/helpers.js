

Template.registerHelper('username', function (user) {
  var twitter = this.services.twitter
  if (twitter){
    return twitter.screenName
  } else {
    return this.profile.username
  }
});

Template.registerHelper('isMobile', function () {
  return Meteor.isCordova;
});
