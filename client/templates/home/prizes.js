Template.prizes.helpers({
	prizes: function () {
		return Admin.find({}).fetch()
	}
});