

Template.registerHelper('userAvatar', function (userId) {
  Meteor.subscribe('findSingleUsername', userId)
  var user = UserList.findOne({_id: userId})

  if (user.profile.avatar) {
    return UI._globalHelpers.c().url(user.profile.avatar.public_id, {hash: {}});
  } else if (user.services && user.services.twitter) {
    var photo = user.services.twitter.profile_image_url;
    return photo.replace('_normal', '');
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

Template.registerHelper('isMobile', function () {
  return Meteor.isCordova;
});
