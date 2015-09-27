Meteor.subscribe('trophy')

Template.trophies.events({
	'submit form': function (event, template) {
		// Get the value of the input box
		event.preventDefault();
		var title = template.find('input[name=title]').value
		var desc = template.find('input[name=description]').value
		var img = template.find('input[name=img]').value
		console.log(title + " " + desc + " " + img)
		Meteor.call("addTrophy", title, desc, img)
	}
});

Template.trophies.helpers({
	trophy: function () {
		return Trophies.find({});
	}
});