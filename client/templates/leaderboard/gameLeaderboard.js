Template.gameLeaderboard.onCreated(function() {
	var gameId = Router.current().params._id
	var query = Router.current().params.query
	var data = {
		gameId: gameId,
		number: query.number,
		period: query.period,
		filter: query.filter,
		groupId: query.groupId,
		matchupId: query.matchupId
	}
	Session.set('leaderboardData', data)

	this.getFilter = () => Session.get('leaderboardData');
	this.autorun(() => {
		this.subscribe( 'leaderboardGamePlayed', this.getFilter());
	});
});

Template.gameLeaderboard.helpers({});

Template.gameLeaderboard.events({});

Template.miniLeaderboard.helpers({
	// 'userNotInLeaderboard': function(number){
	// 	var userId = Meteor.userId()
	// 	var data = Session.get('leaderboardData')
  //   var all = GamePlayed.find().fetch();
	//
  //   var leaderboard = all.map(function(x) {
  //     var thisUser = {userId: x.userId, coins: x.coins}
  //     return thisUser;
  //   });
  //   var spot = _.indexOf(_.pluck(leaderboard, 'userId'), userId);
	//
  //   var userSpot = leaderboard[spot]
  //   if (userSpot){
  //     userSpot.spot = spot + 1
  //   }
	//
	// 	if(spot > data.number){
	// 		return userSpot;
	// 	}
	//
	// },
  'player': function(number){
		var userId = Meteor.userId()
		var data = Session.get('leaderboardData')
    var following = Meteor.user().profile.following
    var list = GamePlayed.find({}).fetch();
		if (number){
			data.number = number
			Session.set('leaderboardData', data)
		}

		var leaderboardList = function(list){
			var fixed = _.sortBy(list, function(obj){return - obj.coins})
			var rank = _.first(fixed, data.number)
			var i = 1
			var followers = _.map(fixed, function(user){
				var isFollowingUser = following.indexOf(user.userId)
				if(isFollowingUser !== -1){
					user.following = true
				}
				user.rank = i
				i++
			});

			return rank
		}

    return leaderboardList(list)
  },
  'username': function(userId) {
		var user = UserList.findOne({_id: userId});
    return user.profile.username
  },
	'following': function(){
		if(this.following){
			return "following"
		}
	},
	'thisUser': function(){
		var userId = Meteor.userId()
		if(this.userId === userId){
			return "history-inprogress"
		}
	},
  'pathUrl': function () {
    // https://github.com/meteoric/meteor-ionic/issues/66
    var url = "/user-profile/" + this.userId
    return url
  },
});
