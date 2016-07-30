Template.betaList.helpers({
	user: function () {
	  var selector = {"profile.beta_request": true}
	  return UserList.find(selector).fetch()
	},
	questionsAnswered: function () {
		var userId = this._id
		Meteor.subscribe('answersByUser', userId)
		return Answers.find({userId: userId}).count()
	}
});

Template.betaList.events({
	'click [data-action=addToBeta]': function() {
		var user = this._id
		Meteor.call("addToBeta", user)
	}
})