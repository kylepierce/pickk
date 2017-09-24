Template.history.helpers({
	noGamesPlayed: function(){
		var count = Games.find().count()
		if (count === 0) {
			return true
		}
	},
  gamesPlayed: function() {
    // var selector = {users: Meteor.userId()};
    return Games.find({}, {sort: {dateCreated: 1}});
  }
});
