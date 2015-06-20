Meteor.subscribe('profileUpdate');

Template.settings.helpers({
	username: function () {
		var currentUser = Meteor.user();
		if (currentUser.services.twitter){
			return currentUser.services.twitter.screenName;
		} else {
			return currentUser.username;
		}
		},


	firstName: function () {
		var currentUser = Meteor.user();
		if (currentUser.services.facebook){
			return currentUser.services.facebook.first_name;
		} else {
			return currentUser.firstName;
		}
	},


	lastName: function () {
		var currentUser = Meteor.user();
		if (currentUser.services.facebook){
			return currentUser.services.facebook.last_name;
		} else {
			return currentUser.firstName;
		}
	},
});

Template.settings.events({
	'submit form': function (event) {
		event.preventDefault();
		var currentUserId = Meteor.userId();

		var username = event.target.username.value;
		var firstName = event.target.firstName.value;
		var lastName = event.target.lastName.value;

		Meteor.call('updateProfile', currentUserId, username, firstName, lastName);

		Router.go('/');
	}
});