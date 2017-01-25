Template.home.rendered = function () {
  // If the user was invited to a game or group we want to redirect them to the correct place after the push prompt.
  var deeplink = Session.get("deepLinked");
  console.log(deeplink);
  if(deeplink["$deeplink_path"] && deeplink["$deeplink_path"] !== ''){
    handleOpenURL(deeplink["$deeplink_path"])
  }

  $('.hero-section').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 20000,
    accessibility: false,
    arrows: false,
    mobileFirst: true,
  });
};

Template.home.helpers({
  hero: function () {
    return Hero.find({}).fetch()
  },
  gamePrediction: function () {
    return Questions.find({}).count()
  },
  dailyPickkCount: function () {
    return Questions.find({}).count()
  },
  liveGames: function(){
    return Games.find({live: true}).count()
  },
  listLiveGames: function(){
    return Games.find({live: true})
  },
  upcomingGames: function(){
    return Games.find({live: false}).count()
  },
  listUpcomingGames: function(){
    return Games.find({live: false})
  }
});

Template.home.events({
  'click [data-action=game-leaderboard]': function(event, template){
    var userId = Meteor.userId()
    analytics.track("home-leaderboard", {
      userId: userId,
    });
    Router.go('/week-leaderboard/')
  },
  'click [data-action=history]': function(event, template){
    var userId = Meteor.userId()
    analytics.track("home-history", {
      userId: userId,
    });
    Router.go('/history')
  },
  'click [data-action=notifications]': function(event, template){
    var userId = Meteor.userId()
    analytics.track("home-notifications", {
      userId: userId,
    });
    Router.go('/notifications')
  },
  'click [data-action=chat]': function(event, template){
    var userId = Meteor.userId()
    analytics.track("home-chat", {
      userId: userId,
    });
  },
  'click [data-action=game-prediction]': function(event, template){
    var userId = Meteor.userId()
    analytics.track("home-game-pickks", {
      userId: userId,
    });
    Router.go('/daily-pickks')
  },
  'click [data-action=viewAllGames]': function(){
    Session.set('gamesDate', "week");
    var all = ["NBA", "NFL", "MLB"]
    Session.set('gamesBySport', all);
    Router.go('/games')
  }
});


// else if (post.tag == "leader") {
//         IonPopup.show({
//           title: 'Leaderboard Winnings!',
//           template: message,
//           buttons: [{
//             text: 'Got It!',
//             type: 'button-positive',
//             onTap: function() {
//               Meteor.call('removeNotification', id);
//               $('body').removeClass('popup-open');
//               $('.backdrop').remove();
//               Blaze.remove(this.view);
//             }
//           }]
//         });
//       } else if (post.source == "Exchange") {
//         message = '<img style="max-width:100%;" src="/storeowner.png">' + message
//         IonPopup.show({
//           title: 'Diamond Exchange',
//           template: message,
//           buttons: [{
//             text: 'Got It!',
//             type: 'button-positive',
//             onTap: function() {
//               Meteor.call('removeNotification', id);
//               $('body').removeClass('popup-open');
//               $('.backdrop').remove();
//               Blaze.remove(this.view);
//             }
//           }]
//         });
//       }
