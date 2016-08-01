

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
});

Template.registerHelper('gameCoins', function (user, game) {
	if ( game === "null" || game === undefined ) {
		var game = Session.get('GamePlayed');
	}	
	var gameObj = GamePlayed.findOne({gameId: game, userId: user});
	return gameObj.coins
});