Template.notificationFilter.helpers({
	options: function () {
		var userSettings = Meteor.user().notifications
		console.log(userSettings) 
		return ["diamonds", "coins", "chat"]
	}
});