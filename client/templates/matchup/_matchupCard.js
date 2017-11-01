Template.matchupCard.onCreated(function() {
  this.subscribe('singleGameData', this.data.m.gameId[0]);
});

Template.matchupCard.helpers({
  'matchupName': function(){
    if(this.m && this.m.gameId.length === 1){
      var gameId = this.m.gameId[0]
      var game = Games.findOne({_id: gameId});
      if(game){
        return game.name
      }
    } else {
      return this.m.matchupLength + " Matchup"
      // var names = []
      // for (var i = 0; i < this.m.gameId.length; i++) {
      //   var gameId = this.m.gameId[i]
      //   var game = Games.findOne({_id: gameId});
      //   if(game){
      //     names.push(game.name);
      //   }
      // }
      // return names
    }
  },
  'joined': function(){
    var userId = Meteor.userId();
    var alreadyJoined = this.m.users.indexOf(userId)
    if(alreadyJoined > -1){
      return "joined"
    }
  },
  'commissioner': function(matchup){
    var leagueId = matchup.leagueId

    if(leagueId){
      Meteor.subscribe('singleGroup', leagueId);
      var league = Groups.findOne({_id: leagueId});
      if(league){
        var commissioner = league.name
      }
    } else {
      var userId = matchup.commissioner
      Meteor.subscribe('findSingle', userId);
      var user = UserList.findOne({_id: userId});
      if( user ){
        var commissioner = user.profile.username
      }
    }
    return commissioner
  },
  'league': function(){
    if(this.m.secret === "league"){
      return true
    }
  },
  'leagueName': function(leagueId){
    Meteor.subscribe('singleGroup', leagueId);
    var league = Groups.findOne({_id: leagueId})
    if (league){
      return league.name
    }
  },
  'username': function(ref) {
		Meteor.subscribe('findSingle', ref);
    var user = UserList.findOne({_id: ref})
    if (user){
      return user.profile.username
    }
	},
  'gameName': function(gameId){
    var game = Games.findOne({_id: gameId})
    if (game){
      return game.name
    }
  },
  'users': function (userArray){
    return userArray.length
  },
  'limitNum': function(number){
    if(number === -1){
      return "∞"
    } else {
      return number
    }
  }
});

Template.matchupCard.events({
  'click [data-action=viewMatchup]': function(e,t){
    Router.go('/matchup/'+ this.m._id)
  }
});

Template.matchupDetails.helpers({
  sections: function(){
    var userId = Meteor.userId();
    var matchup = this.m

    memberCount = function(matchup){
      var members = matchup.users.length
      if(matchup.limitNum !== -1){
        var limit = " / " + matchup.limitNum
      } else {
        var limit = " / ∞"
      }
      return members + limit
    }

    // requestsToJoin = function(matchup){
    //   if(matchup.requests){
    //     var number = matchup.requests.length
    //   } else{
    //     var number = 0
    //   }
    //   var requests = {headline: number, title: "Requests" }
    //   return requests
    // }

    privacyObject = function(matchup){
      if(matchup.secret === "invite"){
        var privacy = {icon: "invite", title: "Invite"}
      } else if(matchup.secret === "league"){
        var privacy = {icon: "league", title: "League"}
      } else if(matchup.secret === "location"){
        var privacy = {icon: "location", title: "Location"}
      } else {
        var privacy = {icon: "public", title: "Public"}
      }
      return privacy
    }

    timeToGame = function(matchup){
      var gameId = matchup.gameId[0]
      Meteor.subscribe('singleGameData', gameId);
      var game = Games.findOne({_id: gameId});
      if (game){
        var end = Chronos.moment(game.iso)
        var current = Chronos.moment()
        var clock = end.diff(current, "seconds");
        if (clock < 0){
          return {headline: "Live", title: "Game"}
        }
        var duration = moment.duration(clock, 'seconds');
        // var formatted = duration.format("DD:HH:MM:ss");
        var base = duration._data
        var time = base.days + ":" + base.hours + ":" + base.minutes + ":" + base.seconds
        return {icon: "stopwatch", title: time}
      }
    }

    // weeklyRanking = function(matchup){
    //   var rank = "1st"
    //   var members = matchup.members.length
    //   var rankingObj = {headline: rank, title: "of " +
    //   members }
    //   return rankingObj
    // }

    matchupLength = function(matchup){
      var len = matchup.matchupLength;
      var number = len[0]
      var length = len[1]
      if (length === "Q"){
        var period = "Quarter"
      } else if (length === "H"){
        var period = "Half"
      } else if (length === "G"){
        var period = "Game"
      }
      return {headline: number, title: period}
    }
    // if (this.commissioner === Meteor.userId()){
    //   var sections = [
    //     weeklyRanking(this),
    //     notifications(this._id),
    //     requestsToJoin(this)
    //   ]
    // } else if (this.members.indexOf(userId) > -1){
    //   var sections = [
    //     weeklyRanking(this),
    //     notifications(this._id),
    //     matchupSports(this)
    //   ]
    // } else {
    //   var sections = [
    //     privacyObject(this),
    //     {icon: "player", title: memberCount(this)},
    //     {icon: "podium", title: "Rank"},
    //     matchupSports(this)
    //   ]
    // }

  var sections = [
    {icon: "player", title: memberCount(matchup)},
    privacyObject(matchup),
    matchupLength(matchup),
    timeToGame(matchup)
  ]
  return sections
  }
});
