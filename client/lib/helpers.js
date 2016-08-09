// Template.oneUsername.onCreated(function() {
//   if (!this.data.alreadySubscribed && !this.data.user) {
//     this.subscribe('findSingleUsername', this.data.userId);
//   }
// });

Template.registerHelper('username', function (user) {
  return this.profile.username
});

Template.registerHelper('userObj', function ( userId ) {
	if (userId) {
		var user = Meteor.users.findOne({_id: userId})
	} else if (this.userId) {
		var user = Meteor.users.findOne({_id: this.userId})
	} else if (this.user){
		var user = this.user
	}  
	return user
});

Template.registerHelper('messageText', function(item){
  return item.message.replace(/(@[^\s]+)/g, "<strong>$1</strong>");
});

Template.registerHelper('isMobile', function () {
  return Meteor.isCordova;
});

Template.registerHelper('userTimeZone', function (date) {
	var timezone = Meteor.user().profile.timezone
	var gameTime = moment(date)
	return gameTime.tz(timezone).format("MMM Do h:mm a z");
});