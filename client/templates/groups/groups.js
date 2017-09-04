Template.leaguesOverview.helpers({
  userLeague: function() {
    var currentUser = Meteor.userId();
    return Groups.find().fetch()
  },
  noLeaguesJoined: function(){
    var count = Groups.find().count()
    if(count === 0){
      return true
    }
  }
});

Template.leaguesOverview.events({
  'click .newGroup': function () {
    Router.go('/newgroup');
  },
  'click [data-action=no-group]': function (){
    Router.go('/allGroups')
  }
});

Template.leagueCard.events({
  "click [data-action=viewLeague]": function(e, t) {
    if (this.__originalId){
      var id = this.__originalId
    } else {
      var id = this._id
    }
    Router.go('group.show', {_id: id});
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
      var number = league.requests.length
      var requests = {headline: number, title: "Requests" }
      return requests
    }

    futureMatchups = function(league){
      Meteor.subscribe('singleGroupMatchupCount', league._id)
      var count = Counts.get('singleGroupMatchupCount')
      var matchup = {headline: count, title: "Matchups" }
      return matchup
    }

    privacyObject = function(league){
      if(league.secret === "invite"){
        var privacy = {icon: "star", title: "Invite Only"}
      } else if(league.secret === "private"){
        var privacy = {icon: "star", title: "Private"}
      } else {
        var privacy = {icon: "star", title: "Public"}
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
      var rankingObj = {headline: rank, title: members + " players" }
      return rankingObj
    }

    if (this.commissioner === Meteor.userId()){
      var sections = [
        notifications(this._id),
        futureMatchups(this),
        weeklyRanking(this),
        requestsToJoin(this)
      ]
    } else if (this.members.indexOf(userId) > -1){
      var sections = [
        notifications(this._id),
        futureMatchups(this),
        weeklyRanking(this),
        {icon: "star", title: "Section?"}
      ]
    } else {
      var sections = [
        privacyObject(this),
        {icon: "star", title: memberCount(this)},
        {icon: "star", title: "Section?!"},
        {icon: "star", title: "Section?!"}
      ]
    }
  return sections
  }
});
