Template.home.onCreated( function() {
  this.subscribe( 'activeHero', function() {
    $( ".loader-holder" ).delay( 100 ).fadeOut( 'slow', function() {
      $( ".loading-wrapper" ).fadeIn( 'slow' );
    });
  });
});

Template.home.onRendered( function() {
  // $.each($(".complete-game-card"), function(i, el){
  //   console.log(this);
  //   setTimeout(function(){
  //     $(el).css("opacity","1");
  //     $(el).addClass("fadeInRight","400");
  //   }, 100 + ( i * 100 ));
  // });
  $( "svg" ).delay( 250 ).fadeIn();
});

Template.home.rendered = function () {
  // If the user was invited to a game or group we want to redirect them to the correct place after the push prompt.
  var deeplink = Session.get("deepLinked");
  if(deeplink && deeplink["$deeplink_path"] && deeplink["$deeplink_path"] !== ''){
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
    return Hero.find({}).fetch();
  },
  gamePrediction: function () {
    return Questions.find({}).count();
  },
  dailyPickkCount: function () {
    return Questions.find({}).count();
  },
  listGames: function(){
    return Games.find({}, {sort: {"status": 1}});
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
    Router.go('/groups');
  },
  'click [data-action=matchups-button]': function(e, t){
    Router.go('/matchups');
  },
  'click [data-action=allGames]': function(e, t){
    Session.set('gamesDate', "month");
    var all = ["NBA", "NFL", "MLB"]
    Session.set('gamesBySport', all);
    Router.go('/games')
  },
});
