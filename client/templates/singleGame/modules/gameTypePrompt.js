Template.gameTypePrompt.onCreated( function() {
  var gameId = Router.current().params._id
  this.subscribe( 'singleGame', gameId,  function() {
    $( ".spin-loader" ).delay( 100 ).fadeOut( 'slow', function() {
      $( ".loading-wrapper" ).fadeIn( 'slow' );
    });
  });
});

Template.gameTypePrompt.onRendered( function() {
  $( "svg" ).delay( 50 ).fadeIn();
});


Template.gameTypePrompt.helpers({
  notFootball: function (){
    var game = Games.findOne();
    var sport = game.sport
    if (sport !== "MLB"){
      return true
    }
  }
});

Template.gameTypePrompt.events({
  'click [data-action="joinGame"]': function (e,t) {
    var user = Meteor.user();
    var game = Games.findOne();
    var text = e.target.innerText.toLowerCase( )

    var gamePlayed = {
      gameId: game._id,
      dateCreated: new Date(),
      userId: user._id,
      period: game.period,
      type: text
    }

    var opinion = checkUsersOpinion(game, user)
    var data = _.extend(gamePlayed, opinion)
    analytics.track("joined game", data);

    if(Meteor.isCordova){
      //Intercom needs unix time with '_at' in JSON to work.
      var intercomData = {
        "last_game_joined_at": parseInt(Date.now() / 1000),
        "type": text,
        "userId": user._id,
        "last_period": game.period,
        "last_game": game._id
      }

      updateIntercom(intercomData)
      Branch.setIdentity(user._id)
      var eventName = 'joined_game';
      Branch.userCompletedAction(eventName)
    }
    Meteor.call('userJoinsAGame', data);
    Meteor.subscribe('gamePlayed', user._id, game._id);
    var leaderData = Session.get('leaderboardData')
  	leaderData["period"] = game.period,
  	Session.set('leaderboardData', leaderData)
    IonLoading.show({
      customTemplate: "Providing Coins...",
      duration: 1000,
      backdrop: true
    });
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
