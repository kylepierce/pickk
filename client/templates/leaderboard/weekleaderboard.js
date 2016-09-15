Template.weekLeaderboard.helpers({
	'players': function(){
		var thisWeek = Router.current().params.id
		
		if (!thisWeek){
			var thisWeek = moment().week()
		}

		var thisWeek = parseInt(thisWeek);
		Session.set('leaderboardWeek', thisWeek);
		var thisWeek = Session.get('leaderboardWeek');

	  var day = moment().day()
	  if (day <= 1){
	    var thisWeek = thisWeek - 1
	  }

		Fetcher.retrieve("weekLeaderboard", "loadWeekLeaderboard", thisWeek)
		var leaderboard = Fetcher.get("weekLeaderboard")
		return leaderboard
	},
	'single': function(player){
		return player
	},
	'date': function() {
		var thisWeek = Session.get('leaderboardWeek');
	  var day = moment().day()
	  
	  if (day <= 1){
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


Template.weekLeaderboard.events({
	'click [data-action=lastWeek]': function () {
		var thisWeek = Session.get('leaderboardWeek');
		var lastWeekNumber = thisWeek - 1
		var lastWeek = '/week-leaderboard/' + lastWeekNumber
		Router.go(lastWeek)
	},
	'click .single-user': function (){
		Router.go('/user-profile/'+ this.id)
	}
});