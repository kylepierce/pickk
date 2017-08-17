Template.home.onCreated( function() {
  this.subscribe( 'activeHero', function() {
    $( ".loader-holder" ).delay( 100 ).fadeOut( 'slow', function() {
      $( ".loading-wrapper" ).fadeIn( 'slow' );

      $.each($(".complete-game-card"), function(i, el){
        setTimeout(function(){
          $(el).css("opacity","1");
          $(el).addClass("fadeInRight","400");
        }, 100 + ( i * 100 ));
      });

      $('.hero-section').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 20000,
        accessibility: false,
        arrows: false,
        mobileFirst: true,
      });
    });
  });
});

Template.home.onRendered( function() {
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
