Template.home.rendered = function () {
  // If the user was invited to a game or group we want to redirect them to the correct place after the push prompt.
  var deeplink = Session.get("deepLinked");
  if(deeplink && deeplink["$deeplink_path"] && deeplink["$deeplink_path"] !== ''){
    handleOpenURL(deeplink["$deeplink_path"])
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
    return Games.find({ pre_game_processed: true }, { sort: { iso: 1 } });
  },
  upcomingGames: function(){
    return Games.find({ status: "Pre-Game", pre_game_processed: { $exists: false }}, {sort: {iso: 1}});
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
