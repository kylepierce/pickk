var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);


Template.mainLayout.rendered = function() {
  // IonSideMenu.snapper.settings({disable: 'right'});
  IonSideMenu.snapper.settings({touchToDrag: false});
};

Template.sideMenuContent.events({
  'click [data-action=logout]': function () {
    AccountsTemplates.logout();
    if (Meteor.isCordova) {
      Branch.logout();
    }
    analytics.reset();
    Router.go("/landing")
	},
  'click [data-action=profile]': function () {
    var userId = Meteor.userId();
    Router.go("/user-profile/" + userId)
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
  },
  'click .contact-us': function (e, t){
    e.preventDefault()
    if (Meteor.isCordova) {
      intercom.displayMessenger();
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
  },
  'click [data-action="gameEdit"]': function (e, t) {
    IonPopover.show('_editGame', this, e.currentTarget);
  }
});

Template.sideMenuContent.onCreated( function() {
  this.diamonds = new ReactiveVar( "0" )
});

Template.sideMenuContent.helpers({
  messageCount: function (){
    intercom.unreadConversationCount();
  },
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
        // If there isnt any data set to zero
        if (result[0] === "undefined"){
          template.diamonds.set(0)
        }
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

Template.loader.rendered = function() {
  var start = parseInt(new Date().getTime() / 1000);
  Session.set('timeRendered', start);
};

Template.loader.helpers({
  takingAwhile: function () {
    var rendered = parseInt(new Date().getTime() / 1000);
    var created = Session.get('timeRendered');
    var start = parseInt(created);
    var rightNow = parseInt(Chronos.now() / 1000)
    var timeSpent = rightNow - start
    if(timeSpent > 14 && rendered > created){
      return true
    }
  }
});

Template.loader.events({
  'click [data-action="back"]': function () {
    var previous = window.history.go(-2);
    Router.go(previous);
  },
  'click [data-action="reload"]': function () {
    Router.go("/");
    location.reload();
  },
});
