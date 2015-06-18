Meteor.subscribe('profileUpdate');

Template.settings.helpers({
	username: function () {
		currentUser = Meteor.user();
		if (currentUser.services.twitter){
			return currentUser.services.twitter.screenName;
		}
		return currentUser.username;
		console.log(currentUser.username)
		},


	firstName: function () {
		currentUser = Meteor.user();
		if (currentUser.services.facebook){
			return currentUser.services.facebook.first_name;
		} if (currentUser.services.twitter){
			return currentUser.services.twitter.last_name;
		}
		return currentUser.profile.firstName;
	},


	lastName: function () {
		currentUser = Meteor.user();
		if (currentUser.services.facebook){
			return currentUser.services.facebook.last_name;
		} if (currentUser.services.twitter){
			return currentUser.services.twitter.last_name;
		}
		return currentUser.profile.firstName;
	},
});

Template.settings.events({
	'submit form': function (event) {
		event.preventDefault();
		var currentUserId = Meteor.userId();
		console.log(currentUser);

		var username = event.target.username.value;
		var firstName = event.target.firstName.value;
		var lastName = event.target.lastName.value;

		Meteor.call('updateProfile', currentUserId, username, firstName, lastName);

		Router.go('/');
	}
});