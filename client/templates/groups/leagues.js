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
  'click .newGroup': function () {
    Router.go('/newgroup');
  },
  'click [data-action=no-group]': function (){
    Router.go('/allGroups')
  }
});
