Template.prizes.onCreated(function() {
	this.subscribe('prizes');
});

Template.prizes.helpers({
	prizes: function () {
		return Admin.find({}).fetch()
	}
});
