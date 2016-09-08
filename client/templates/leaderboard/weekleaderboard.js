Template.weekLeaderboard.helpers({
	'players': function(){
		var thisWeek = moment().week()
	  var day = moment().day()
	  if (day < 2){
	    var thisWeek = thisWeek - 1
	  }
		Fetcher.retrieve("weekLeaderboard", "loadWeekLeaderboard", thisWeek)
		var leaderboard = Fetcher.get("weekLeaderboard")
		return leaderboard
	},
	'date': function() {
		var thisWeek = moment().week()
	  var day = moment().day()
	  if (day < 2){
	    var thisWeek = thisWeek - 1
	  }
	  var startDay = moment().day("Tuesday").week(thisWeek)._d;
		var endDay = moment().day("Monday").week(thisWeek+1)._d;
		var startDay = moment(startDay).format("MMM Do")
		var endDay = moment(endDay).format("MMM Do")
	  
	  return startDay + " - " + endDay 
	},
	'username': function(userId){
		var user = UserList.findOne({_id: userId})
   	return user.profile.username
	}
}); 
