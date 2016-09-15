Template.gameLeaderboard.helpers({
	'player': function(){
		var $game = Router.current().params.id
		// Users change so much this loads the users once. 
		Fetcher.retrieve("leaderboard", "loadLeaderboard", $game)
		var leaderboard = Fetcher.get("leaderboard")
		return GamePlayed.find({gameId: $game}, {sort: {coins: -1}, limit: 25})
	},
	'username': function(userId) {
		return UserList.findOne({_id: userId});
	},
	'pathUrl': function () {
		// https://github.com/meteoric/meteor-ionic/issues/66
		var url = "/user-profile/" + this.userId
		return url
	}
});
