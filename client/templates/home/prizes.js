Template.prizes.onCreated(function() {
	this.subscribe('prizes');
});

Template.prizes.helpers({
	prizes: function () {
		var selector = {}
		var query = Router.current().params.query
		if(query.matchup && query.matchupId){
			selector.matchupId = query.matchupId
		} else if (query.league && query.leagueId){
			selector.leagueId = query.leagueId
		}
		return Prizes.find(selector, {sort: {rank: 1}}).fetch()
	},
	dateEnd: function(time){
		var end = Chronos.moment(time)
		var current = Chronos.moment()
		var clock = end.diff(current, "seconds");
		var duration = moment.duration(clock, 'seconds');
		var base = duration._data
		var time = base.days + " Days " + base.hours + " Hours " + base.minutes + " Mins " + base.seconds + " Seconds"
		return { icon: "stopwatch", title: time }
	}
});