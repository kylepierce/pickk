Template.leagues.onCreated(function() {
  var userId = Meteor.userId();
  // this.subscribe("findThisUsersLeagues", userId);
});

Template.leagues.helpers({
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

Template.leagues.events({
  'click [data-action=no-league]': function(){
    analytics.track('Click "No League"', {});
    Router.go('/searchLeagues');
  }
});

Template.leagueOverviewLinks.events({
  'click [data-action=viewAll]': function () {
    analytics.track('Click "View All Leagues"', {});
    Router.go('/searchLeagues');
  },
  'click [data-action=createLeague]': function () {
    analytics.track('Click "Create League"', {});
    Router.go('/league/create');
  }
});