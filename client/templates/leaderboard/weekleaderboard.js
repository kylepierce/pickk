Template.weekLeaderboard.onCreated(function() {
var filter = Router.current().params.query.filter
var groupId = Router.current().params.query.groupId
if(filter){
	Session.set('leaderboardFilter', filter);
}
if(groupId){
	Session.set('leaderboardGroupId', groupId);
}
});


Template.weekLeaderboard.helpers({
	'players': function(){
		var day = moment().day()
		var thisWeek = Router.current().params.id
		if (!thisWeek){ var thisWeek = moment().week() }
		var thisWeek = parseInt(thisWeek);
	  if (day <= 1){ var thisWeek = thisWeek - 1 }
		Session.set('leaderboardWeek', thisWeek);

		var leaderboardList = function(list){
			var fixed = _.sortBy(list, function(obj){return obj.diamonds})
			var list = fixed.reverse()
			var rank = _.first(list, 25)
			return rank
		}

		var shortList = function(all, array){
			var list = _.filter(all, function(user){
				var onTheList = array.indexOf(user._id)
				if (onTheList !== -1){
					return user
				}
			});
		return list
		}

		Fetcher.retrieve("weekLeaderboard", "loadWeekLeaderboard", thisWeek)
		var leaderboard = Fetcher.get("weekLeaderboard");
		var filter = Session.get('leaderboardFilter');

		// Only show the results from the filters
		switch (filter) {
			case "All":
				return leaderboardList(leaderboard)
				break;

			case "Followers":
				var followers = Meteor.user().profile.followers
				var list = shortList(leaderboard, followers)
				return leaderboardList(list)
				break;

			case "Following":
				var following = Meteor.user().profile.following
				var list = shortList(leaderboard, following)
				return leaderboardList(list)
				break;

			case "group":
				var groupId = Session.get('leaderboardGroupId');
				var group = Groups.findOne({_id: groupId});
				var members = group.members
				var list = shortList(leaderboard, members)
				return leaderboardList(list)
				break;

			default:
				return leaderboardList(leaderboard)
				break;
		}

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
