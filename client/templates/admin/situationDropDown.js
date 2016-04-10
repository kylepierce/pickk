Template.situationDropDown.helpers({
	team1: function () {
		var live =  Games.find({live: true}).fetch();
		console.log(live.teams)
		return "Hey World!"
	}
});