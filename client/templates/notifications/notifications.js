Meteor.subscribe('userAnswer');

Template.gameNotifications.helpers({
	'question': function () {
		var currentUser = Meteor.userId();
		var userData = UserList.find({_id: currentUser}).fetch();
		return userData.questionsAnswered
		console.log('hello')
	}
});