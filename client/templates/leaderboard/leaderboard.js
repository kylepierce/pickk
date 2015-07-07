Meteor.subscribe('leaderboard');

// Create a list function baed on the number of users. It can be repeated.

Template.leaderboard.helpers({
	'player': function(){
		return UserList.find({},{sort: {profile: -1,}}).fetch();
	},
	'groups': function(){
		var currentUser = Meteor.user();
		return currentUser.profile.groups
	}
}); 


// Create each group list

Template.groupLeaderboard.helpers({
	players: function(groupId){
		return UserList.find({"profile.groups": groupId},{sort: {profile: -1,}}).fetch();
	}, 
	groupName: function(groupId){
		return Groups.findOne({_id: groupId});
	}
}); 

// Display each group that user is in

	// currentUser.groups

// Display the name of the group with the _id as refrence

// Show the top 10 users in the group

// Display their usersnames, coins, and link to their profile