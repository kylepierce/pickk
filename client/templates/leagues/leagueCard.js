Template.leagueCard.events({
  "click [data-action=viewLeague]": function(e, t) {
    if (this.__originalId){
      var id = this.__originalId
    } else {
      var id = this._id
    }
    analytics.track('Click League Card', {
      leagueId: id
    });
    Router.go('league.show', {_id: id});
  }
});

Template.leagueCard.helpers({
  'joined': function(){
    if (this) {
      var userId = Meteor.userId();
      var alreadyJoined = this.members.indexOf(userId)
      if(alreadyJoined > -1){
        return "joined"
      }
    }
  },
  'commissioner': function(){
    if(this){
      var userId = this.commissioner
      Meteor.subscribe('findSingle', userId);
      var user = UserList.findOne({_id: userId});
      if (user) {
        return user.profile.username
      }
    }
  },
  'single': function(){
    if (this.single){
      return "hidden"
    }
  }
});

Template.leagueDetails.onCreated(function(){
  this.subscribe('singleLeagueMatchupCount', this.data._id)
});

Template.leagueDetails.helpers({
  sections: function(){
    var userId = Meteor.userId();

    memberCount = function(league){
      var members = league.members.length
      if(this.limit === "true"){
        var number = this.limitNum
        var limit = " / " + number
      } else {
        var limit = " / ∞"
      }
      return members + limit
    }

    requestsToJoin = function(league){
      if(league.requests){
        var number = league.requests.length
      } else{
        var number = 0
      }
      var requests = {headline: number, title: "Requests" }
      return requests
    }

    // futureMatchups = function(league){
    //   var count = Counts.get('singleLeagueMatchupCount', league._id)
    //   var matchup = {headline: count, title: "Matchups" }
    //   return matchup
    // }

    privacyObject = function(league){
      if(league.secret === "invite"){
        var privacy = {icon: "invite", title: "Invite"}
      } else if(league.secret === "private"){
        var privacy = {icon: "private", title: "Private"}
      } else if(league.secret === "location"){
        var privacy = {icon: "location", title: "Location"}
      } else {
        var privacy = {icon: "public", title: "Public"}
      }
      return privacy
    }

    notifications = function(leagueId){
      Meteor.subscribe('unreadLeagueNotificationCount', leagueId)
      var count = Counts.get('unreadLeagueNotificationCount')
      var notificationObj = {headline: count, title: "Alerts"}
      if (count > 0){
        notificationObj.alert = "notification-alert"
      }
      return notificationObj
    }

    weeklyRanking = function(league){
      var rank = "1st"
      var members = league.members.length
      var rankingObj = {headline: rank, title: "of " + members }
      return rankingObj
    }

    leagueSports = function(league){
      if(!league.association){
        var sports = {headline: "All", title: "Sports"}
      } else if (league.association.length === 1) {
        var sports = {icon: "location", title: league.association}
      } else {
        var sports =  {list: league.association}
      }
      return sports
    }

    if (this.commissioner === Meteor.userId()){
      var sections = [
        // weeklyRanking(this),
        // notifications(this._id),
        // futureMatchups(this),
        // requestsToJoin(this)
      ]
    } else if (this.members.indexOf(userId) > -1){
      var sections = [
        // weeklyRanking(this),
        // notifications(this._id),
        // futureMatchups(this),
        // leagueSports(this)
      ]
    } else {
      var sections = [
        privacyObject(this),
        {icon: "player", title: memberCount(this)},
        {icon: "leaderboard", title: "Rank"},
        leagueSports(this)
      ]
    }
  return sections
  }
});
