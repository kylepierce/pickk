Template.rules.rendered = function(){
	var userId = Meteor.userId();
}

Template.rules.helpers({
	rules: function () {
		return Rules.find({}, {sort: {order: -1}});
	}
});
