// Template.weekLeaderboard.rendered = function() {
//     console.log(this.data); // you should see your passage object in the console
// };

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
		var fixed = _.sortBy(leaderboard, function(obj){return obj.diamonds})
		var list = fixed.reverse()
		var rank = _.first(list, 25)
		return rank
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

});

Template.singlePlayerWeek.onCreated( function() {
	this.diamonds = new ReactiveVar( "0" )
})

Template.singlePlayerWeek.helpers({
	'username': function(userId){
		var template = Template.instance()
		var user = UserList.findOne({_id: userId})
		if(user){
			return user.profile.username
		}
	}
});

Template.weekLeaderboard.events({
	'click .single-user': function (){
		Router.go('/user-profile/'+ this.id)
	},

	'click [data-action=previous]': function (e, t){
    // Find the week from router or session
    var weekNumber = Router.current().params.id
    if (weekNumber === null || weekNumber === undefined) {
      var weekNumber = moment().week()
    }
    //Last week
    var previousWeek = parseInt(weekNumber) - 1
    Router.go("/week-leaderboard/" + previousWeek)
  },

  'click [data-action=next]': function (e, t){
		// Find the week from router or session
    var weekNumber = Router.current().params.id
    if (weekNumber === null || weekNumber === undefined) {
      var weekNumber = moment().week()
    }
    //Next week
    var nextWeek = parseInt(weekNumber) + 1
    Router.go("/week-leaderboard/" + nextWeek)
  }
});
