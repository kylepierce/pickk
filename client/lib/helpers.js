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

Template.registerHelper('emojiIconSrc', function (reactionName) {
	switch(reactionName) {
	  case "dead":
	      return '/emoji/Full-Color/Emoji-Party-Pack-01.svg';
	    break;
	  case "omg":
	      return '/emoji/Full-Color/Emoji-Party-Pack_Artboard%20119.svg';
	    break;
	  case "fire":
	      return '/emoji/Full-Color/Emoji-Party-Pack_Artboard%20119.svg';
	    break;
	  case "dying":
	      return '/emoji/Full-Color/Emoji-Party-Pack-13.svg';
	    break;
	  case "hell-yeah":
	      return '/emoji/Full-Color/Emoji-Party-Pack_Artboard%20109.svg';
	    break;
	  case "what":
	      return '/emoji/Full-Color/Emoji-Party-Pack_Artboard%20112.svg';
	    break;
	  case "pirate":
	      return '/emoji/Full-Color/Emoji-Party-Pack-24.svg';
	    break;
	  case "love":
	      return '/emoji/Full-Color/Emoji-Party-Pack-58.svg';
	    break;
	  case "tounge":
	      return '/emoji/Full-Color/Emoji-Party-Pack-86.svg';
	    break;
	  case "oh-no":
	      return '/emoji/Full-Color/Emoji-Party-Pack-93.svg';
	    break;
	  case "what-the-hell":
	      return '/emoji/Full-Color/Emoji-Party-Pack-96.svg';
	    break;
 	}
});