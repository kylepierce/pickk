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
	'userNotInLeaderboard': function(number){
		var userId = Meteor.userId()
		var data = Session.get('leaderboardData')
    // var currentPeriod = Games.findOne({_id: data.gameId}).period
    var all = GamePlayed.find().fetch();

    var leaderboard = all.map(function(x) {
      var thisUser = {userId: x.userId, coins: x.coins}
      return thisUser;
    });
    var spot = _.indexOf(_.pluck(leaderboard, 'userId'), userId);

    var userSpot = leaderboard[spot]
    if (userSpot){
      userSpot.spot = spot + 1
    }

		if(spot > data.number){
			return userSpot;
		}

	},
  'player': function(number){
		var userId = Meteor.userId()
		var data = Session.get('leaderboardData')

    var list = GamePlayed.find({}, {sort: {coins: -1}}).fetch();
		var filter = data.filter
		if (number){
			data.number = number
			Session.set('leaderboardData', data)
		}

		var leaderboardList = function(list){
			var fixed = _.sortBy(list, function(obj){return - obj.coins})
			var rank = _.first(fixed, data.number)
			return rank
		}

		var shortList = function(all, array){
			var list = _.filter(all, function(user){
				var onTheList = array.indexOf(user.userId)
				if (onTheList !== -1){
					return user
				}
			});
			return list
		}

		// Only show the results from the filters
		switch (filter) {
			case "All":
				return leaderboardList(list)
				break;

			case "Followers":
				var followers = Meteor.user().profile.followers
				var list = shortList(list, followers)
				return leaderboardList(list)
				break;

			case "Following":
				var following = Meteor.user().profile.following
				var list = shortList(list, following)
				return leaderboardList(list)
				break;

			case "group":
				var groupId = data.groupId;
				var group = Groups.findOne({_id: groupId});
				var members = group.members
				var list = shortList(list, members)
				return leaderboardList(list)
				break;

			case "matchup":
				var matchupId = data.matchupId;
				var matchup = Matchup.findOne({_id: matchupId});
				var members = matchup.users
				var list = shortList(list, members)
				return leaderboardList(list)
				break;

			default:
				return leaderboardList(list)
				break;
		}

    return list
  },
  'username': function(userId) {
    return UserList.findOne({_id: userId});
  },
  'following': function (userId) {
    var user = Meteor.user();
    var following = user.profile.following
    var isFollowing = following.indexOf(userId)
    if (isFollowing > 0){return true}
  },
  'pathUrl': function () {
    // https://github.com/meteoric/meteor-ionic/issues/66
    var url = "/user-profile/" + this.userId
    return url
  },
});
