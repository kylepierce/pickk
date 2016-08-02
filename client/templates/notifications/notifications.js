Template.notifications.helpers({
	notifications: function () {
		var userId = Meteor.userId();
		var notifications = Notifications.find({userId: userId}).fetch()
		console.log(notifications)
		return notifications
	}, 
	request: function() {
		return this.pendingNotifications
	},
	alert: function(type) {
		var userId = Meteor.userId();
		var notifications = Notifications.find({userId: userId, type: type }).fetch()
		console.log(notifications)
		return notifications
	},
	type: function(obj, type) {
		console.log(obj)
		return obj.type === type
	},  
	trophy: function(id) {
		var trophy = Trophies.findOne({_id: id});
		return trophy 
	},
	// score: function() {
	// 	return score
	// },

});

Template.notification.helpers({
	group: function(){
		if(this.note.type === "group"){
			return this.note
		}
	},
	chat: function(){
		if(this.note.type === "mention"){
			return this.note
		}
	},
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

Template.groupNotification.helpers({
	user: function(ref) {
		Meteor.subscribe('findSingle', ref);
		return UserList.findOne({_id: ref})
	},
	groupData: function(groupId) {
		Meteor.subscribe('singleGroup', groupId);
		return Groups.findOne({_id: groupId})
	}
});

Template.chatNotification.helpers({
	user: function(ref) {
		Meteor.subscribe('findSingle', ref);
		return UserList.findOne({_id: ref})
	},
	groupData: function(groupId) {
		Meteor.subscribe('singleGroup', groupId);
		return Groups.findOne({_id: groupId})
	}
});






