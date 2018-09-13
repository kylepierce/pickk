Template.sideMenuContent.helpers({
  links: function(){
    return [
      {title: "Home", path: "home", icon: "home"},
      {title: "Prizes", path: "prizes", icon: "prizes"},
      // {title: "Game Schedule", path: "games", icon: "games"},
      // {title: "Matchups", path: "matchup", icon: "matchup"},
      // {title: "Leagues", path: "leagues", icon: "league"},
      // {title: "Week Leaderboard", path: "week-leaderboard", icon: "leaderboard"},
      {title: "Common Questions", path: "rules", icon: "faq"},
      {title: "Game History", path: "history", icon: "scoreboard"},
      {title: "Settings", path: "settings", icon: "settings"},
    ]
  }
});

Template.sideMenuContent.events({
  'click [data-action=edit-profile-photo]': function(){
    analytics.track("Click Profile Photo");
    IonSideMenu.snapper.close(); 
    Router.go("/userPhoto")
  },
  'click [data-action=profile]': function () {
    var userId = Meteor.userId();
    analytics.track("Click Profile Icon");
    IonSideMenu.snapper.close(); 
    Router.go("/user-profile/" + userId)
  },
  'click [data-action=edit-profile]': function () {
    analytics.track("Click Settings Icon");
    IonSideMenu.snapper.close();
    Router.go("/settings")
  },
  'click .item-icon-left': function (){
    IonSideMenu.snapper.close(); 
  },
  'click .js-share-link': function(event) {
    event.preventDefault();
    var branchUniversalObj = null;
    var ref = Meteor.userId()
    var username = Meteor.user().profile.username
    var message = "Play Against Me and Predict What Happens Next in Live Sports With Pickk!"
    if(Meteor.isCordova){
      Branch.createBranchUniversalObject({
        canonicalIdentifier: 'user-profile/'+ ref,
        title: 'Live Game Challenge!',
        contentDescription: message,
        contentMetadata: {
          'userId': ref,
          'userName': username
        }
      }).then(function (newBranchUniversalObj) {
        branchUniversalObj = newBranchUniversalObj;
        branchUniversalObj.showShareSheet({
          // put your link properties here
          "feature" : "share",
          "tags": ['menu']
        }, {
          // put your control parameters here
          "$deeplink_path" : "/user-profile/" + ref,
        }, message);
      });
    }

    // Analytics
    analytics.track("Invite Friend", {
      userId: ref,
      location: "Menu"
    });
  },
  'click [data-action=notifications]': function(){
    IonSideMenu.snapper.close();
    Router.go('/notifications/?read=false');
  },
  'click [data-action=allNotifications]': function(){
    IonSideMenu.snapper.close();
    Router.go('/notifications');
  },
  'click .custom-list': function(){
    IonSideMenu.snapper.close();
  }
});
