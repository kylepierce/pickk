Meteor.methods({
	'addSituational': function(que){
		check(que, String);
		Admin.insert({
			que: que,
			situational: true
		});
	}
})