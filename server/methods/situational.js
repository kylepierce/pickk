Meteor.methods({
	'addSituational': function(que){
		check(que, String);
		Admin.insert({
			que: que,
			situational: true
		});
	},
	'addPrize': function (){
		Admin.insert({
			title: "",
			prizes: true,
			active: true,
			photo: "",
			text: "",
		});
	}
})