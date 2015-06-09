Template.sideMenuContent.helpers({
	photo: function () {
		currentUser = Meteor.user();

		if (currentUser.services.twitter){
			var photo = currentUser.services.twitter.profile_image_url
			var cleanPhoto = photo.replace('_normal', '')
			return cleanPhoto;
		} if (currentUser.services.facebook) {
        avatar = "http://graph.facebook.com/" + currentUser.services.facebook.id + "/picture/?type=square&height=500&width=500";
        console.log(avatar);
        return avatar;
    } else {
    	return "/photo.jpg"
    }
	}	
});


Template.sideMenuContent.events({
  'click [data-action=logout]': function () {
    AccountsTemplates.logout();
	},
    'click [data-action=toggleMenu]': function(){
        $(div.loginArea).toggleClass ("hidden-account", false);
    }
});

Meteor.subscribe('leaderboard');
