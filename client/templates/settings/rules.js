Template.rules.rendered = function(){
	var userId = Meteor.userid();
	if(Meteor.isCordova){
		//Intercom needs unix time with '_at' in JSON to work.
		var intercomData = {
			"viewed_rules": true,
			"last_viewed_rules_at": parseInt(Date.now() / 1000),
			"userId": userId,
		}
		updateIntercom(intercomData)
	}
}

Template.rules.helpers({
	rules: function () {
		return Rules.find({}, {sort: {order: -1}});
	}
});
