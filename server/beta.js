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
		Meteor.call('addToOneSignal', user)
		mailChimpLists.subscribeUser(user, {double_optin: false});
	},
	'addToOneSignal':function(user){
		check(user, Object)

		var oneSignalId = user.oneSignalToken
		var postUrl = "https://onesignal.com/api/v1/players/" + oneSignalId
		console.log(postUrl)
		var appId = Meteor.settings.public.oneSignal.appId
		var basic = "Basic " + appId
		this.unblock();
		var results = HTTP.call("PUT", postUrl,
			{
				data: {"tags": {"beta": 1}},
				headers: {Authorization: basic}, 
			},
          function (error, result) {
            if (!error) {
              console.log("sucess")
            } else {
            	console.log(error)
            }
          }
    ); 
	} 
})