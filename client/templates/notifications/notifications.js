Template.notifications.helpers({
	notifications: function () {
		var userId = Meteor.userId();
		var notifications = Notifications.find({userId: userId}).fetch()
		return notifications
	}, 
});

Template.notification.helpers({
	item: function(type){
		if(this.note.type === type){
			return this.note
		}
	}
});

Template.notifications.events({
	'click [data-action=delete]': function () {
		var notificationId = this._id
		Meteor.call('removeNotification', notificationId);
	}
});

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

Template.groupNotification.events({
	'click [data-action=delete]': function () {
		var notificationId = this.note._id
		Meteor.call('removeNotification', notificationId);
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

Template.trophyNotification.helpers({
	trophy: function (trophyId) {
		return Trophies.findOne({_id: trophyId})
	},
	game: function ( gameId ) {
		return Game.findOne({_id: gameId});
	}
});




