Template.leagues.onCreated(function() {
  var userId = Meteor.userId();
  this.subscribe("findThisUsersLeagues", userId);
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
  'click [data-action=search-leagues]': function(){
    analytics.track("Click Search", {
      location: "Header"
    });
    Router.go('/searchLeagues');
  },
  'click [data-action=no-league]': function(){
    analytics.track('Click "No League"', {});
    Router.go('/searchLeagues');
  }
});
