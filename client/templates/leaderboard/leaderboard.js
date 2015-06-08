Meteor.subscribe('leaderboard');


Template.leaderboard.helpers({
	'player': function(){
		return UserList.find({},{sort: {profile: -1,}}).fetch();
	}
}); 

