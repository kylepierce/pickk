Template.situationDropDown.helpers({
	team1: function () {
		var live =  Games.find({live: true}).fetch();
		return "Hey World!"
	}
});