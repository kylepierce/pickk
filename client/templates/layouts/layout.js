var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);

Template.mainView.rendered = function() {
  // IonSideMenu.snapper.settings({disable: 'right'});  
  IonSideMenu.snapper.settings({touchToDrag: false});
};

Template.sideMenuContent.events({
  'click [data-action=logout]': function () {
    AccountsTemplates.logout();
    Router.go("/")
	},
  'click .js-share-link': function(event) {
    event.preventDefault();
    if (Meteor.isCordova) {
      window.plugins.socialsharing.shareWithOptions({
        message: Meteor.settings.public.share.message,
        url: 'http://bit.ly/download-pickk-app',
      });
    }
  }
});

Template.mainView.events({
  'click [data-action=refresh]': function () {
    IonLoading.show({
      customTemplate: '<h3>Loading...</h3>',
      duration: 1500,
      backdrop: true
    })
    Fetcher.refresh('leaderboard')
  },
  'click [data-action=refresh-week]': function () {
    IonLoading.show({
      customTemplate: '<h3>Loading...</h3>',
      duration: 1500,
      backdrop: true
    })
    Fetcher.refresh('weekLeaderboard')
  }
});

Template.sideMenuContent.helpers({
  pendingNotifications: function(){
    var user = Meteor.user();
    return !! user && user.pendingNotifications && user.pendingNotifications.length;
  },
  notificationNumber: function() {
    var user = Meteor.user();
    return user && user.pendingNotifications && user.pendingNotifications.length;
  }
});
