Meteor.methods({
	'uniqueUsername': function(username){
		var user = UserList.findOne({"profile.username": username});
		if(!user){
			console.log("Seems to be unique")
			var result = true
		} else {
			console.log("Seems to be taken")
			var result = false
		}
		return result
	}
})