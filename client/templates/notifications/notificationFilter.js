Template.notificationFilter.helpers({
	options: function () {
		var userSettings = Meteor.user().notifications
		console.log(userSettings) 
		return ["Read", "Unread", "Diamonds", "Coins", "Chat"]
	}
});