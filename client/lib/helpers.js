

Template.registerHelper('username', function (user) {
  return this.profile.username
});

Template.registerHelper('isMobile', function () {
  return Meteor.isCordova;
});

Template.registerHelper('userTimeZone', function (date) {
	var timezone = Meteor.user().profile.timezone
	var gameTime = moment(date)
	return gameTime.tz(timezone).format("MMM Do h:mm a z");
})
