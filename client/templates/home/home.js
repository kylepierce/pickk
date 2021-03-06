Template.home.rendered = function () {
  // If the user was invited to a game or group we want to redirect them to the correct place after the push prompt.
  var deeplink = Session.get("deepLinked");
  if(deeplink && deeplink["$deeplink_path"] && deeplink["$deeplink_path"] !== ''){
    handleOpenURL(deeplink["$deeplink_path"])
  }
  var user = Meteor.user()
  if(user.profile.username === undefined){
    Router.go('/editProfile');
  } else if (user.profile.over18 === undefined || user.profile.over21 === undefined){
    Router.go('/editProfile');
  }

  if (Meteor.isCordova) {
    window.plugins.OneSignal.getPermissionSubscriptionState(function (status) {
      var hasPrompted = status.permissionStatus.hasPrompted;
      if (!hasPrompted){
        Router.go('/push-active');
      } else if (status.subscriptionStatus.userId) {
        if (!user.oneSignal) {
          Meteor.call('updateOneSignal', status.subscriptionStatus.userId);
        } else if (user.oneSignal && !user.oneSignal.userId) {
          console.log(user._id, " Updated their push settings.")
          Meteor.call('updateOneSignal', status.subscriptionStatus.userId);
        } 
        // If its been a while since the code was update,
        // else if (user.oneSignalToken.lastUpdated )
      }
    });
  }
};

Template.homeGames.onCreated(function() {
  this.subscribe('liveGames');
  this.subscribe('prePickkGames');
  this.subscribe('upcomingGames');
});

Template.homeGames.helpers({
  listGames: function(){
    return Games.find({status: "In-Progress"});
  },
  prePickk: function () {
    return Games.find({ pre_game_processed: true });
  },
  upcomingGames: function(){
    return Games.find({ status: "Pre-Game", pre_game_processed: { $exists: false }});
  },
});

Template.home.events({
  'click [data-action=location]': function(e, t) {
    IonLoading.show({
      customTemplate: 'Incorrect location. Email hi@pickk.co for locations.',
      duration: 1500,
      backdrop: true
    });
    e.preventDefault();
  },
  'click [data-action=game-prediction]': function(event, template){
    analytics.track("Click Pickk Six", {
      location: "Home"
    });
    Router.go('/daily-pickks')
  },
  'click [data-action=viewAllGames]': function(){
    Session.set('gamesDate', "month");
    var all = ["NBA", "NFL", "MLB"]
    Session.set('gamesBySport', all);
    Router.go('/games')
  },
  'click [data-action=invite-friends]': function (event, template) {
    analytics.track("Click Invite Friends", {
      location: "Home"
    });

    var branchUniversalObj = null;
    var ref = Meteor.userId()
    var username = Meteor.user().profile.username
    var message = "Play Against Me and Predict What Happens Next in Super Bowl 52!"
    if (Meteor.isCordova) {
      Branch.createBranchUniversalObject({
        canonicalIdentifier: 'user-profile/' + ref,
        title: 'Super Bowl Challenge!',
        contentDescription: message,
        contentMetadata: {
          'userId': ref,
          'userName': username
        }
      }).then(function (newBranchUniversalObj) {
        branchUniversalObj = newBranchUniversalObj;
        branchUniversalObj.showShareSheet({
          // put your link properties here
          "feature": "share",
          "tags": ['menu']
        }, {
            // put your control parameters here
            "$deeplink_path": "/user-profile/" + ref,
          }, message);
      });
    }
  },
});

Template.dailyPickkButton.helpers({
  gamePrediction: function () {
    return Questions.find({}).count();
  },
  dailyPickkCount: function () {
    return Questions.find({}).count();
  },
});

// Template.homeButtons.helpers({
//   buttons: function(){
//     var buttonArray = Admin.findOne({location: "home", type: "buttons"});
//     console.log(buttonArray);
//   },
// });

Template.homeButtons.events({
  'click [data-action=notification-button]': function(e, t){
    analytics.track('Click "Notifications"', {
      location: "Home"
    });
    Router.go('/notifications/?read=false');
  },
  'click [data-action=leagues-button]': function(e, t){
    analytics.track('Click "Leagues"', {
      location: "Home"
    });
    Router.go('/leagues');
  },
  'click [data-action=matchups-button]': function(e, t){
    analytics.track('Click "Matchups"', {
      location: "Home"
    });
    Router.go('/matchup');
  },
  'click [data-action=allGames]': function(e, t){
    analytics.track('Click "View Games"', {
      location: "Home"
    });
    Session.set('gamesDate', "month");
    var all = ["NBA", "NFL", "MLB"]
    Session.set('gamesBySport', all);
    Router.go('/games')
  },
});
