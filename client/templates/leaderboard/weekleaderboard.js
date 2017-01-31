Template.weekLeaderboard.onCreated(function() {
	var filter = Router.current().params.query.filter
	var query = Router.current().params.query
	var groupId = Router.current().params.groupId
	//If there is no new data
	var data = Session.get('leaderboardFilter');
	var noNewData = _.isEmpty(data);

	if(noNewData || !data) {
		if(!query) {
			var data = {}
		} else if (groupId){
			var data = {
				filter: "group",
				groupId: groupId
			}
		} else {
			var data = query
		}
	}
	if(!data.date){
		var thisWeek = parseInt(moment().week());
		var day = moment().day()
		if (day <= 1){ var thisWeek = thisWeek - 1 }
		data.date = thisWeek
	}
	if (!data.filter){
		data.filter = "All"
	}
	Session.set('leaderboardFilter', data);

	var self = this;
	self.getFilter = function () {
		return Session.get('leaderboardFilter');
	}
	self.autorun(function() {
		self.subscribe( 'weekLeaderboard', self.getFilter(), function(){
			$( ".loader-holder" ).delay( 500 ).fadeOut( 'slow', function() {
	      $( ".loading-wrapper" ).fadeIn( 'slow' );
			});
		});
	});
});

Template.weekLeaderboard.onRendered( function() {
  $( "svg" ).delay( 250 ).fadeIn();
});

Template.weekLeaderboard.helpers({
	'players': function(){
		var following = Meteor.user().profile.following
		var leaderboardList = function(list){
			var fixed = _.sortBy(list, function(obj){return - obj.diamonds})
			var rank = _.first(fixed, 25)
			var i = 1
			_.map(rank, function(user){
				var isFollowingUser = following.indexOf(user._id)
				if(isFollowingUser >= 0){
					user.following = true
				}
				user.rank = i
				i++
			});
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
		var data = Session.get('leaderboardFilter');
		Fetcher.retrieve("weekLeaderboard", "loadWeekLeaderboard", data)
		var leaderboard = Fetcher.get("weekLeaderboard");

		// Only show the results from the filters
		switch (data.filter) {
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
				var groupId = data.groupId
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
	// 'date': function() {
	//   var startDay = moment().day("Tuesday").week(date)._d;
	// 	var endDay = moment().day("Monday").week(date+1)._d;
	// 	var startDay = moment(startDay).format("MMM Do")
	// 	var endDay = moment(endDay).format("MMM Do")
	//
	//   return startDay + " - " + endDay
	// },

});

Template.singlePlayerWeek.helpers({
	'username': function(userId){
		var user = UserList.findOne({_id: userId})
		if(user){
			return user.profile.username
		}
	},
	'following': function(){
		if(this.player.following){
			return "following"
		}
	},
	'thisUser': function(){
		var userId = Meteor.userId()
		if(this.userId === userId){
			return "history-inprogress"
		}
	},
});

Template.weekLeaderboard.events({
	"click .leaderboard-item": function(e, t){
		 Router.go("/user-profile/" + this.player._id)
	}
	//
	// 'click [data-action=previous]': function (e, t){
  //   // Find the week from router or session
  //   var weekNumber = Router.current().params.id
  //   if (weekNumber === null || weekNumber === undefined) {
  //     var weekNumber = moment().week()
  //   }
  //   //Last week
  //   var previousWeek = parseInt(weekNumber) - 1
  //   Router.go("/week-leaderboard/" + previousWeek)
  // },
	//
  // 'click [data-action=next]': function (e, t){
	// 	// Find the week from router or session
  //   var weekNumber = Router.current().params.id
  //   if (weekNumber === null || weekNumber === undefined) {
  //     var weekNumber = moment().week()
  //   }
  //   //Next week
  //   var nextWeek = parseInt(weekNumber) + 1
  //   Router.go("/week-leaderboard/" + nextWeek)
  // }
});
