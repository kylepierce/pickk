Meteor.subscribe('profile');

Template.registerHelper('singleAvatar', function () {
	// var currentUser = Meteor.user();
 //  var twitter = currentUser.services.twitter
 //  var facebook = currentUser.services.facebook

  return '/twitter_logo.png'

  //  if (twitter !== "undefined"){
  //     var photo = currentUser.services.twitter.profile_image_url
  //     var cleanPhoto = photo.replace('_normal', '')
  //     return cleanPhoto;

  // } else if (facebook) {
  //     avatar = "http://graph.facebook.com/" + currentUser.services.facebook.id + "/picture/?type=square&height=500&width=500";
  //     console.log(avatar);
  //     return avatar;

  //  } else {return 'twitter_logo.png'}
    
});