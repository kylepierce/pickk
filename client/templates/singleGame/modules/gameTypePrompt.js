Template.gameTypePrompt.onCreated( function() {
  var gameId = Router.current().params._id;
  var game = Games.findOne({})
  if (game.sport === "NFL"){
    var background = {
      "background": "linear-gradient(rgba(34, 44, 49, .30), rgba(34, 44, 49, .20)), url('/join-football-game.png')",
      "height": "100%",
      "background-size": "cover",
      "background-position-x": "50%",
      "background-position-y": "100%"
    }

  } else if (game.sport === "MLB") {
    var background = {
          "background": "linear-gradient(rgba(34, 44, 49, .0), rgba(34, 44, 49, .5)), url('/baseball-background.png')",
          "height": "100%",
          "background-size": "cover",
          "background-position-x": "50%",
          "background-position-y": "100%"
        }
    console.log(background);
  }
  $('.content').css(background);
  this.subscribe( 'singleGame', gameId,  function() {
    $( ".spin-loader" ).delay( 100 ).fadeOut( 'slow', function() {
      $( ".loading-wrapper" ).show().fadeIn( 'slow' );
    });
  });
});

Template.gameTypePrompt.onRendered( function() {
  $( "svg" ).delay( 50 ).fadeIn();
});

Template.gameTypeChoice.helpers({
  numberOfOptions: function(options, shrink){
    var optionCount = options.length
    var size = parseInt(100 / optionCount)
    if (shrink){ var size = size - 5 }
    if (optionCount === 1){ var size = 100 }
    return "col-md-" + size
  },
  alert: function (featured) {
    if (featured){
      return "highlight-option"
    }
  }
});

Template.gameTypePrompt.helpers({
  sportIs: function (sport) {
    var game = Games.findOne();
    switch (game.sport) {
      case "MLB":
        var playTypes = {
          title: "Select Contest Type",
          subTitle: "Join Pickk MLB Contest",
          desc: "Note: You Select Play Type Every 3 Innings.",
          options: [
            // {
            //   title: "Live",
            //   icon: '<img src="/baseball-calls/Strike.svg">',
            //   gameType: "Live",
            //   style: "background-color: rgba(51, 205, 95, .85);",
            //   desc: "Predict Outcome of Each Pitch and Each Batter.",
            //   button: "button-balanced",
            //   featured: true
            // }, 
            {
              title: "Batter",
              style: "background-color: rgba(0, 0, 0, .65);",
              gameType: "AtBat",
              icon: '<img src="/baseball-calls/Hit.svg">',
              desc: "Predict Outcome Of Each Batter."
          }
        ]
        }
        return playTypes
        break;
      case "NFL":
        var playTypes = {
          title: "Select Contest Type",
          subTitle: "Join Pickk NFL Contest",
          desc: "Note: You Select Play Type Every Quarter. Coins and diamonds from previous quarter are saved but you get new set of coins to compete.",
          options: [{
              title: "Live",
              gameType: "Live",
              style: "background-color: rgba(51, 205, 95, .85);",
              icon: '<i class="fa fa-bolt quarter-prompt-icon"></i>',
              desc: "Play by Play. Earn More Diamonds.",
              button: "button-balanced"
            }, {
              title: "Drives",
              gameType: "Drive",
              style: "background-color: rgba(0, 0, 0, .65);",
              icon: '<i class="fa fa-hourglass-start quarter-prompt-icon"></i>',
              desc: "15 questions each quarter"
            }]
        }
        return playTypes
        break;
      case "NBA":
        var playTypes = {
          title: "Select Contest Type",
          subTitle: "Join Pickk NBA Contest",
          desc: "Note: You Select Play Type Every Quarter.",
          options: [{
              title: "Live",
              icon: '<i class="fa fa-bolt quarter-prompt-icon"></i>',
              desc: "Every Pitch and Batter.",
              button: "button-balanced"
            }]
        }
        return playTypes
        break;
    }
  }
});

Template.gameTypePrompt.events({
  'click [data-action="joinGame"]': function (e,t) {
    var $gameId = Router.current().params._id
    var userId = Meteor.userId();
    var user = Meteor.user();
    var game = Games.findOne();
    var type = e.currentTarget.dataset.value.toLowerCase( )

    var data = {
      gameId: $gameId,
      dateCreated: new Date(),
      userId: userId,
      period: game.period,
      type: type
    }

    // var opinion = checkUsersOpinion(game, user)
    // var data = _.extend(gamePlayed, opinion)
    // analytics.track("joined game", data);

    analytics.track("joined game", data);

    if(Meteor.isCordova){
      Branch.setIdentity(userId)
      var eventName = 'joined_game';
      Branch.userCompletedAction(eventName)
    }

    // Meteor.subscribe('gamePlayed', $gameId);

    var leaderData = Session.get('leaderboardData');
  	// leaderData["period"] = game.period

    var onSuccess = function(position) {
      data.location = position
    };

    // onError Callback receives a PositionError object
    function onError(error) {
        alert('Location must be added to win prizes. Please update the settings. Code: ' + error.code + 'message: ' + error.message + '\n' );
        data.location = null
    }
    if(Meteor.isCordova){
      var location = navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true});
    }
    Meteor.call('userJoinsAGame', data);

  	Session.set('leaderboardData', leaderData);
    IonLoading.show({
      customTemplate: "Providing Coins...",
      duration: 1000,
      backdrop: true
    });
    Router.go('game.show', {_id: $gameId});
  }
});

checkUsersOpinion = function (game, user){
  var data = {}
  var sport = game.sport
  var teams = game.teamAbbr
  var favoriteSports = user.profile.favoriteSports
  if (sport === "football"){ var sport = "NFL"}
  var lastSport = sport
  var date = new Date();
  var playData = {
    lastSport: lastSport
  }
  playData[sport] = {
    date: date,
    teams: teams
  }
  analytics.identify(user._Id, playData)

  // If the user likes the sport see if they like the team.

  if (favoriteSports) {
    var likesThisSport = favoriteSports.includes(sport)
    data["likesSport"] = true,
    data["teamLiked"] = sport
    var userFavoriteSportTeam = user.profile["favorite" + sport + "Teams"]
    var likesThisTeam = _.intersection(teams, userFavoriteSportTeam)
    if (likesThisTeam.length > 0){
      data["likesTeam"] = true
      data["teamLiked"] = likesThisTeam
    } else {
      // Doesnt like this team but still playing. Lets add that to analytics.
      data["likesTeam"] = false
    }
  } else {
    // Doesnt like the sports but still playing. Lets add that to analytics.
    data["likesSport"] = false
    data["likesTeam"] = false
  }

  return data
}
