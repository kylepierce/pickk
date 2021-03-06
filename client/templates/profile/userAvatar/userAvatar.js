Template.userAvatar.helpers({
  photoSize: function(){
    switch (this.size) {
      case "large":
        return "photo-size-large"
        break;
      case "medium":
        return "photo-size-medium"
        break;
      default:
        return "photo-size-small"
    }
  },
  url: function() {
    var user = UserList.findOne({_id: this.userId});
    if (user) {
      if (user.profile.avatar && user.profile.avatar != 'twitter_logo.png' && user.profile.avatar != "/twitter_logo.png" /* backwards compatibility */) {
        return UI._globalHelpers.c().url(user.profile.avatar.public_id, {hash: {}});
      } else if (user.services && user.services.twitter) {
        var photo = user.services.twitter.profile_image_url_https;
        return photo.replace('_normal', '');
      } else if (user.services && user.services.facebook) {
        return "https://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=square&height=500&width=500";
      } else {
        return "/anon.png"
      }
    }
  }
});

Template.userAvatar.onCreated(function() {
  if (!this.data.alreadySubscribed && !this.data.user) {
    this.subscribe('findSingleUsername', this.data.userId);
  }
});
