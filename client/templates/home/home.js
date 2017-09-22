Template.home.onRendered( function() {
});

Template.home.rendered = function () {
  // If the user was invited to a game or group we want to redirect them to the correct place after the push prompt.
  var deeplink = Session.get("deepLinked");
  if(deeplink && deeplink["$deeplink_path"] && deeplink["$deeplink_path"] !== ''){
    handleOpenURL(deeplink["$deeplink_path"])
  }
};

Template.home.helpers({
  listGames: function(){
    Meteor.subscribe('liveGames')
    return Games.find();
  },
});

Template.home.events({
  'click [data-action=game-prediction]': function(event, template){
    var userId = Meteor.userId()
    analytics.track("home-game-pickks", {
      userId: userId,
    });
    Router.go('/daily-pickks')
  },
  'click [data-action=viewAllGames]': function(){
    Session.set('gamesDate', "month");
    var all = ["NBA", "NFL", "MLB"]
    Session.set('gamesBySport', all);
    Router.go('/games')
  }
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
    Router.go('/notifications/?read=false');
  },
  'click [data-action=leagues-button]': function(e, t){
    Router.go('/leagues');
  },
  'click [data-action=matchups-button]': function(e, t){
    Router.go('/matchup');
  },
  'click [data-action=allGames]': function(e, t){
    Session.set('gamesDate', "month");
    var all = ["NBA", "NFL", "MLB"]
    Session.set('gamesBySport', all);
    Router.go('/games')
  },
});
