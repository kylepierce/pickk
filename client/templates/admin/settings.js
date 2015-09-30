Meteor.subscribe("leaderboard")

Template.adminSettings.events({
	'submit form': function (event, template) {
		// Get the value of the input box
		event.preventDefault();
		var coins = template.find('input[name=coins]').value
		console.log(coins)
		if(confirm("Are you sure?")) {
			Meteor.call("updateAllCoins", coins)
		}
	}
});