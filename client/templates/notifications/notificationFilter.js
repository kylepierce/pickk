Template.notificationFilter.helpers({
	options: function () {
		return ["group", "mention", "follower", "coins", "diamonds", "leaderboard", "badge", "trophy"]
		// "matchupInvite", "matchupNotification", "chatReaction"
	},
});

Template.notificationFilter.events({
	'change .checkbox': function(e,t){
		Meteor.call('updateNotificationFilter', this.o, function(){
			var userSettings = Meteor.user().profile.notifications
		});
	}
});

Template.notificationOption.helpers({
	alreadySelected: function(){
		var user = Meteor.user()
		if (user){
			var userSettings = user.profile.notifications
			var selected = userSettings.indexOf(this.o)
			if(selected !== -1){
				return true
			}
		}
	}
});
