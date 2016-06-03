var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);

Template.mainView.rendered = function() {
  // IonSideMenu.snapper.settings({disable: 'right'});  
  IonSideMenu.snapper.settings({touchToDrag: false});
};

Template.sideMenuContent.events({
  'click [data-action=logout]': function () {
    AccountsTemplates.logout();
	},
  'click .js-share-link': function(event) {
    event.preventDefault();
    if (Meteor.isCordova) {
      window.plugins.socialsharing.shareWithOptions({
        message: Meteor.settings.public.share.message
      });
    }
  }
});

Template.mainView.events({
  'click [data-action=refresh]': function () {
    Fetcher.refresh('leaderboard')
  },
  'click [data-action=refresh-week]': function () {
    Fetcher.refresh('weekLeaderboard')
  }
});

Template.sideMenuContent.helpers({
  pendingNotifications: function(){
    var user = Meteor.user();
    var notifications = user && user.pendingNotifications.length > 0;
    return notifications;
  },
  notificationNumber: function() {
    var user = Meteor.user();
    var notifications = user && user.pendingNotifications.length || 0;
    return notifications;
  },
  sidebarAvatar: function (userId) {
    console.log(this.user)
    var user = UserList.findOne({_id: userId})
    console.log("+++++++++" + user)

  if (user.services.twitter !== undefined){
    var photo = user.services.twitter.profile_image_url
    var cleanPhoto = photo.replace('_normal', '')
    return cleanPhoto;
  } else if (user.services.facebook !== undefined) {
    avatar = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=square&height=500&width=500";
      console.log(avatar);
    return avatar;
  } else {
    return "/anon.png"
  }
  }
});
