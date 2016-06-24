Template.sportRadarGames.helpers({
	game: function () {
		return SportRadarGames.find({'status': 'scheduled'}, {sort: {"scheduled": 1}}).fetch();
	},

	gameAt: function () {
		return moment(this['scheduled']).format("HH:mm");
	}
});
