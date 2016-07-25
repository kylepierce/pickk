Meteor.methods({
	'requestBetaInvite': function(){
		var timeCreated = new Date();
		var user = Meteor.userId();
		Meteor.users.update({_id: user}, {$set: {"profile.beta_request": true}});
	}
})