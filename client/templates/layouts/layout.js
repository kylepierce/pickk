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
    var userId = Meteor.userId()
    var username = Meteor.user().profile.username
    var url = "pick.co/download/?utm_campaign=menu&utm_content=" + username
    
    // Analytics
    analytics.track("Invite Friend", {
      userId: userId,
      location: "Menu"
    });

    if (Meteor.isCordova) {
      window.plugins.socialsharing.shareWithOptions({
        message: Meteor.settings.public.share.message,
        url: url,
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
    var user = Meteor.userId();
    var number = Notifications.find({userId: user, read: false})
    if(number){
      return true
    }
  },
  notificationNumber: function() {
    var user = Meteor.userId();
    var number = Notifications.find({userId: user, read: false}).count()
    return number
  },
  userId: function () {
    return Meteor.userId();
  },
  connected: function() {
    if (Session.get(SHOW_CONNECTION_ISSUE_KEY)) {
      return Meteor.status().connected;
    } else {
      return true;
    }
  },
  admin: function() {
    var currentUser = Meteor.user();
    return currentUser && currentUser.profile.role === "admin";
  },
  beta: function() {
    var currentUser = Meteor.user();
    return currentUser && currentUser.profile.role === "beta";    
  }
});
