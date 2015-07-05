Meteor.subscribe('profileUpdate');

Template.settings.helpers({
	username: function () {
		var currentUser = Meteor.user();
		if (currentUser.services.twitter){
			$('#username').addClass('left-icon fa fa-check-circle')
			return currentUser.services.twitter.screenName;
		} else {
			$('#username').addClass('left-icon fa fa-check-circle')
			return currentUser.username;
		}
		},


	firstName: function () {
		var currentUser = Meteor.user();
		if (currentUser.services.facebook){
			return currentUser.services.facebook.first_name;
		} else {
			return currentUser.profile.firstName;
		}
	},


	lastName: function () {
		var currentUser = Meteor.user();
		if (currentUser.services.facebook){
			return currentUser.services.facebook.last_name;
		} else {
			return currentUser.profile.lastName;
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
		// var avatar = $('#avatar').prop('src');

		Meteor.call('updateProfile', currentUserId, username, firstName, lastName);

		Router.go('/');
	}
});