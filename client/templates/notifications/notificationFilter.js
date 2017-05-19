Template.notificationFilter.helpers({
	options: function () {
		return ["matchup", "group", "mention", "follower", "coins", "diamonds", "leaderboard", "badge", "trophy", "chatReaction"]
		// "matchupInvite", "matchupNotification", "chatReaction"
	},
	status: function(){
		var data = Session.get('notificationsFilter');
		var list = [
			{name: "All", value: [true, false]},
			{name: "Read", value: [true]},
			{name: "Unread", value: [false]}
		]

		_.each(list, function(item, i){
			if(item.value.toString() === data.status.toString()){
				list[i].checked = true
			}
		});
		return list
	},
	unread: function(){
		var count = Counts.get('unreadNotificationsCount');
		if (count > 0){
			return true
		}
	}
});

Template.notificationFilter.events({
	'click [data-action=readAll]': function(){
		Meteor.call('markAllAsRead');
		sAlert.success("Marked all notifications as read!" , {effect: 'slide', position: 'bottom', html: true});
	},
	'change #status .item-radio': function(e,t){
		var data = Session.get('notificationsFilter');
		data.status = this.value
		Meteor.call('updateNotificationFilter', data, function(){
			var userSettings = Meteor.user().profile.notifications
			Session.set('notificationsFilter', data);
		});
	},
	'change .checkbox': function(e,t){
		var data = Session.get('notificationsFilter');
		console.log(data);
		var alreadySelected = data.type.indexOf(this.o);
		if (alreadySelected === -1){
			data.type.push(this.o)
		} else if (alreadySelected > -1){
			data.type.splice(alreadySelected, 1)
		}
		Meteor.call('updateNotificationFilter', data, function(){
			var userSettings = Meteor.user().profile.notifications
			Session.set('notificationsFilter', data);
		});
	}
});

Template.notificationOption.helpers({
	alreadySelected: function(){
		var user = Meteor.user();
		if (user){
			var userSettings = Session.get('notificationsFilter');
			var selected = userSettings.type.indexOf(this.o)
			if(selected !== -1){
				return true
			}
		}
	}
});
