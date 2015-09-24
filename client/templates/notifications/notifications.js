Meteor.subscribe('userAnswer');
Meteor.subscribe('leaderboard')

Template.notifications.helpers({
	notification: function () {
		var currentUser = Meteor.userId();
		var userData = UserList.findOne({_id: currentUser})
		return userData
	}, 
	request: function() {
		return this.pendingNotifications
	},
	group: function(type) {
		if(type === "group"){
			return true
		} 
	},
	game: function(type) {
		if(type === "game"){
			return this.pendingNotifications
		} 
	},
	user: function(ref) {
		Meteor.subscribe('userAnswer', ref);
		return UserList.findOne({_id: ref})
	},
	groupData: function(groupId) {
		return Groups.findOne({_id: groupId})
	}
});

// Template.gameNotifications.helpers({
// 	'question': function () {
// 		var currentUser = Meteor.userId();
// 		var userData = UserList.findOne({_id: currentUser});
// 		return userData.questionsAnswered
// 	}
// });