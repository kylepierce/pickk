Template.registerHelper('singleAvatar', function () {
	var currentUser = Meteor.user();

   if (currentUser.services.twitter){
      var photo = currentUser.services.twitter.profile_image_url
      var cleanPhoto = photo.replace('_normal', '')
      return cleanPhoto;

  } if (currentUser.services.facebook) {
      avatar = "http://graph.facebook.com/" + currentUser.services.facebook.id + "/picture/?type=square&height=500&width=500";
      console.log(avatar);
      return avatar;

   } else {return 'twitter_logo.png'}
    
});