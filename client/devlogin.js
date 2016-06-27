Meteor.startup(function() {
  var userId = Meteor.userId();
  if (Meteor.settings["public"].isDevLogin) {
    if (!userId && (location.host === "localhost:3000" || location.host.indexOf("192.168") !== -1) && document.cookie.indexOf("autologin=false") === -1) {
      if (jQuery.browser.mozilla) {
        return Meteor.loginWithToken("KnoxOverstreet");
      } else {
        return Meteor.loginWithToken("CharlieDalton");
      }
    }
  }
});
