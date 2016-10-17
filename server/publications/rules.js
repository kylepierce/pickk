Meteor.publish('rules', function(){
	this.unblock()
	return Rules.find({})
});