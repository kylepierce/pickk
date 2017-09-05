Template.matchupCard.helpers({
  'matchupName': function(){
    if(this.m && this.m.gameId.length === 1){
      var gameId = this.m.gameId[0]
      Meteor.subscribe('singleGameData', gameId);
      var game = Games.findOne({_id: gameId});
      if(game){
        return game.name
      }
    } else {
      return this.m.matchupLength + " Matchup"
      // var names = []
      // for (var i = 0; i < this.m.gameId.length; i++) {
      //   var gameId = this.m.gameId[i]
      //   Meteor.subscribe('singleGameData', gameId);
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
    var groupId = matchup.groupId

    if(groupId){
      Meteor.subscribe('singleGroup', groupId);
      var group = Groups.find({_id: groupId}).fetch();
      var commissioner = group[0].name
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
  'group': function(){
    if(this.m.secret === "group"){
      return true
    }
  },
  'groupName': function(groupId){
    Meteor.subscribe('singleGroup', groupId);
    var group = Groups.findOne({_id: groupId})
    if (group){
      return group.name
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
    Meteor.subscribe('singleGameData', gameId);
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

    // memberCount = function(matchup){
    //   var members = matchup.members.length
    //   if(this.limit === "true"){
    //     var number = this.limitNum
    //     var limit = " / " + number
    //   } else {
    //     var limit = " / ∞"
    //   }
    //   return members + limit
    // }

    // requestsToJoin = function(matchup){
    //   if(matchup.requests){
    //     var number = matchup.requests.length
    //   } else{
    //     var number = 0
    //   }
    //   var requests = {headline: number, title: "Requests" }
    //   return requests
    // }

    // futureMatchups = function(matchup){
    //   Meteor.subscribe('singleGroupMatchupCount', matchup._id)
    //   var count = Counts.get('singleGroupMatchupCount')
    //   var matchup = {headline: count, title: "Matchups" }
    //   return matchup
    // }

    // privacyObject = function(matchup){
    //   if(matchup.secret === "invite"){
    //     var privacy = {icon: "invite", title: "Invite"}
    //   } else if(matchup.secret === "league"){
    //     var privacy = {icon: "league", title: "League"}
    //   } else if(matchup.secret === "location"){
    //     var privacy = {icon: "location", title: "Location"}
    //   } else {
    //     var privacy = {icon: "public", title: "Public"}
    //   }
    //   return privacy
    // }

    // notifications = function(matchupId){
    //   Meteor.subscribe('unreadLeagueNotificationCount', matchupId)
    //   var count = Counts.get('unreadLeagueNotificationCount')
    //   var notificationObj = {headline: count, title: "Alerts"}
    //   if (count > 0){
    //     notificationObj.alert = "notification-alert"
    //   }
    //   return notificationObj
    // }

    // weeklyRanking = function(matchup){
    //   var rank = "1st"
    //   var members = matchup.members.length
    //   var rankingObj = {headline: rank, title: "of " +
    //
    //
    //   members }
    //   return rankingObj
    // }

    // matchupSports = function(matchup){
    //   if(!matchup.association){
    //     var sports = {headline: "All", title: "Sports"}
    //   } else if (matchup.association.length === 1) {
    //     var sports = {icon: "location", title: matchup.association}
    //   } else {
    //     var sports =  {list: matchup.association}
    //   }
    //   return sports
    // }

    // if (this.commissioner === Meteor.userId()){
    //   var sections = [
    //     weeklyRanking(this),
    //     notifications(this._id),
    //     futureMatchups(this),
    //     requestsToJoin(this)
    //   ]
    // } else if (this.members.indexOf(userId) > -1){
    //   var sections = [
    //     weeklyRanking(this),
    //     notifications(this._id),
    //     futureMatchups(this),
    //     matchupSports(this)
    //   ]
    // } else {
    //   var sections = [
    //     privacyObject(this),
    //     {icon: "coach", title: memberCount(this)},
    //     {icon: "podium", title: "Rank"},
    //     matchupSports(this)
    //   ]
    // }

  var sections = [
    {icon: "league", title: "Leagues"},
    {icon: "league", title: "Leagues"},
    {icon: "league", title: "Leagues"},
    {icon: "league", title: "Leagues"},
  ]
  return sections
  }
});
