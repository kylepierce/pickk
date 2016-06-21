Template.notifications.helpers({
	notification: function () {
		var currentUser = Meteor.userId();
		var userData = UserList.findOne({_id: currentUser})
		return userData
	}, 
	request: function() {
		return this.pendingNotifications
	},
	alert: function() {
		var currentUser = Meteor.userId();
		var userData = UserList.findOne({_id: currentUser})
		var notifications = userData.pendingNotifications
		return notifications
	},
	type: function(type) {
		return this.type === type
	},  
	trophy: function(id) {
		var trophy = Trophies.findOne({_id: id});
		return trophy 
	},
	// score: function() {
	// 	return score
	// },
	user: function(ref) {
		Meteor.subscribe('findSingle', ref);
		return UserList.findOne({_id: ref})
	},
	groupData: function(groupId) {
		Meteor.subscribe('singleGroup', groupId);
		return Groups.findOne({_id: groupId})
	}
});

Template.notifications.events({
	'click [data-action=delete]': function () {
		var notificationId = this._id
		Meteor.call('removeNotification', notificationId);
	}
});

// Template._notificationPopover.events({
// 	'click #accept': function (id) {
// 		Router.go('group.show');
// 	}
// });