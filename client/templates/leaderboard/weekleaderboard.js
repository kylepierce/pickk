Template.weekLeaderboard.helpers({
	'player': function(){
		Fetcher.retrieve("weekLeaderboard", "loadWeekLeaderboard")
		var leaderboard = Fetcher.get("weekLeaderboard")
		var fixed = _.sortBy(leaderboard, function(obj){return obj.profile.diamonds})
		var list = fixed.reverse()
		return _.first(list, 25)
	},
	'diamonds': function(diamonds){
		if(diamonds == undefined){
			return 0
		}
	},
	'username': function(){
		var twitter = this.services.twitter
  	if(twitter){
   	 return twitter.screenName
  	} else {
   	 return this.profile.username
  	}
	}
}); 
