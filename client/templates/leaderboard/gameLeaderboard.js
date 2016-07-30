Template.gameLeaderboard.helpers({
	'player': function(){
		var $game = Router.current().params.id
		console.log($game)
		Fetcher.retrieve("leaderboard", "loadLeaderboard", $game)
		var leaderboard = Fetcher.get("leaderboard")
		var fixed = _.sortBy(leaderboard, function(obj){return obj.profile.coins})
		var list = fixed.reverse()
		return _.first(list, 25)
	},
	'username': function() {
		return this.profile.username
	}
});