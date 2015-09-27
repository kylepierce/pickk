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
	group: function() {
		var currentUser = Meteor.userId();
		var userData = UserList.findOne({_id: currentUser})
		var notifications = userData.pendingNotifications
		console.log(notifications.notificationId)
		return notifications
	},
	type: function(type) {
		return this.type === type
	}, 
	trophy: function(id) {
		var trophy = Trophies.findOne({_id: id});
		return trophy
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