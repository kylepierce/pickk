Meteor.subscribe('leaderboard');


Template.leaderboard.helpers({
	'player': function(){
		return UserList.find().fetch();
	}
}); 