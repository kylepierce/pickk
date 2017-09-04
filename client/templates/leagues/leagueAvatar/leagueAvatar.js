Template.leagueAvatar.helpers({
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
    var league = this.league
    if (league.avatar && league.avatar != 'twitter_logo.png' && league.avatar != '/twitter_logo.png' /* backwards compatibility */) {
      return league.avatar;
    } else {
      return "/twitter_logo.png";
    }
  }
});
