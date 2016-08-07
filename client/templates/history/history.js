Template.history.helpers({
  gamesPlayed: function() {
    var selector = {users: Meteor.userId()};
    return Games.find(selector, {sort: {dateCreated: -1}});
  }
});
