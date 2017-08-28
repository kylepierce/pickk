Template.leagueAvatar.helpers({
  url: function() {
    if (this.avatar && this.avatar != 'twitter_logo.png' && this.avatar != '/twitter_logo.png' /* backwards compatibility */) {
      return UI._globalHelpers.c().url(this.avatar.public_id, {hash: {}});
    } else {
      return "/twitter_logo.png"
    }
  }
});
