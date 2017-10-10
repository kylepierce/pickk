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
    // console.log("Nada");
  }
});
