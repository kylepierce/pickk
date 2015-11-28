Template.weekLeaderboard.helpers({
	'player': function(){
		Fetcher.retrieve("weekLeaderboard", "loadWeekLeaderboard")
		var leaderboard = Fetcher.get("weekLeaderboard")
		var fixed = _.sortBy(leaderboard, function(obj){return obj.profile.diamonds})
		console.log(fixed)
		var list = fixed.reverse()
		return _.first(list, 25)
	},
	'diamonds': function(diamonds){
		console.log(diamonds)
		if(diamonds == undefined){
			return 0
		}
	}
}); 
