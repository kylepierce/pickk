Meteor.subscribe('leaderboard')

// Template.leaderboard.onCreated( function() {
//   this.subscribe( 'leaderboard', function() {
//   	$( ".slider-pager" ).css('display', 'none');
//     $( ".loader" ).delay( 1000 ).fadeOut( 'slow', function() {
//       $( ".loading-wrapper" ).fadeIn( 'slow' );
//       $( ".slider-pager" ).css('display', 'block');
//  	 });
// 	});
// });

// Template.leaderboard.onRendered( function() {
//   $( "svg" ).delay( 750 ).fadeIn(); 
// });

// Create a list function baed on the number of users. It can be repeated.

Template.leaderboard.helpers({
	'player': function(){
		return UserList.find({}, 
			{sort: {'profile.coins': -1}, limit: 25},
			{fields: {'profile.username': 1, 'profile.coins': 1, 'profile.avatar': 1, '_id': 1}} 
			).fetch();
	},
	'groups': function(){
		var currentUser = Meteor.user();
		return currentUser.profile.groups
	}
}); 


// Display each group that user is in

// Template.groupLeaderboard.helpers({
// 	players: function(groupId){
// 		// Show the top 10 users in the group
// 		// Display their usersnames, coins, and link to their profile
// 		return UserList.find(
// 			{"profile.groups": groupId}, 
// 			{sort: {'profile.coins': -1}},
// 			{fields: 
// 				{'profile.username': 1, 'profile.coins': 1, 'profile.avatar': 1, '_id': 1}}
// 			).fetch();
// 	}, 
// 	groupName: function(groupId){
// 	// Display the name of the group with the _id as refrence
// 		return Groups.findOne({_id: groupId});
// 	}
// }); 