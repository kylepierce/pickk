var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);


Template.mainLayout.rendered = function() {
  // IonSideMenu.snapper.settings({disable: 'right'});  
  IonSideMenu.snapper.settings({touchToDrag: false});
};

Template.sideMenuContent.events({
  'click [data-action=logout]': function () {
    AccountsTemplates.logout();
    Router.go("/landing")
	},
  'click .item-icon-left': function (){
    IonSideMenu.snapper.close();
  },
  'click .js-share-link': function(event) {
    event.preventDefault();
    var userId = Meteor.userId()
    var username = Meteor.user().profile.username
    username = username.toLowerCase()
    var customUrl = "pickk.co/download/?utm_campaign=menu&utm_content=" + username
    var options = {
      message: "Love Sports? Predict What Happens Next With Pickk! " + customUrl
    }
    // Analytics
    analytics.track("Invite Friend", {
      userId: userId,
      location: "Menu"
    });

    if (Meteor.isCordova) {
      window.plugins.socialsharing.shareWithOptions(options);
    }
  } 
});

Template.mainLayout.events({
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

Template.sideMenuContent.onCreated( function() {
  this.diamonds = new ReactiveVar( "0" )
});

Template.sideMenuContent.helpers({
  diamonds: function () {

    var thisWeek = moment().week()
    var day = moment().day()
    if (day < 2){
      var thisWeek = thisWeek - 1
    }
    var userId = Meteor.userId();
    var template = Template.instance()

    Meteor.call("thisWeeksDiamonds", userId, thisWeek, function (error, result) {
      if ( error ){
        console.log(error)
      } else {
        var diamondCount = result[0].result
        template.diamonds.set(diamondCount)
      }
    })

    return Template.instance().diamonds.get();
  },
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
