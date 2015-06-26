Meteor.subscribe('leaderboard');

// Create a list function baed on the number of users. It can be repeated.

Template.leaderboard.helpers({
	'player': function(){
		return UserList.find({},{sort: {profile: -1,}}).fetch();
	}
}); 


// Create each group list

