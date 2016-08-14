Template.rules.helpers({
	rules: function () {
		return Rules.find({}, {sort: {order: -1}})
	}
});