Template.gameLeaderboard.helpers({
	'player': function(){
		var $game = Router.current().params.id
		Fetcher.retrieve("leaderboard", "loadLeaderboard", $game)
		var leaderboard = Fetcher.get("leaderboard")
		// var fixed = _.sortBy(leaderboard, function(obj){return obj.profile.coins})
		// var list = fixed.reverse()
		// return _.first(list, 25)
		return GamePlayed.find({gameId: $game}, {sort: {coins: -1}})
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

Template.gameLeaderboard.events({
	'click .ionItem': function () {
		// ...
	}
});