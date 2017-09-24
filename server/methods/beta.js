Meteor.methods({
	'requestBetaInvite': function(){
		var timeCreated = new Date();
		var user = Meteor.userId();
		Meteor.users.update({_id: user}, {$set: {"profile.beta_request": true}});
	},
	'addToBeta': function(user){
		check(user, String)
		Meteor.users.update({_id: user}, {$set: {"profile.role": "beta", "profile.beta_request": "accepted"}});
		var user = Meteor.users.findOne({_id: user})
		mailChimpLists.subscribeUser(user, {double_optin: false});
	},
	'updateGames': function(){
		Games.update({sport: "NFL", iso: { $exists: true}}, {$set: {dateCreated: "2017-09-27T04:30:00.000Z"}}, {multi: true})
	},

});
