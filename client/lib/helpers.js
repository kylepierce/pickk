

Template.registerHelper('userAvatar', function (userId) {
  Meteor.subscribe('findSingleUsername', userId)
  var user = UserList.findOne({_id: userId})

  if (user.services && user.services.twitter){
    var photo = user.services.twitter.profile_image_url
    var cleanPhoto = photo.replace('_normal', '')
    return cleanPhoto;
  } else if (user.services && user.services.facebook) {
    return "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=square&height=500&width=500";
  } else {
    return "/anon.png"
  }
});

Template.registerHelper('username', function (user) {
  var twitter = this.services.twitter
  if(twitter){
    return twitter.screenName
  } else {
    return this.profile.username
  }
});
