Template.gameLeaderboard.onCreated(function() {
	var filter = Router.current().params.query.filter
	var groupId = Router.current().params.query.groupId
	if(filter){ Session.set('leaderboardFilter', filter); }
	if(groupId){ Session.set('leaderboardGroupId', groupId); }
});

Template.gameLeaderboard.helpers({
  'overview': function (){
    var $period = parseInt(Router.current().params.period)
    if ($period === -1){
      return true
    }
  },
  'noPeriods': function (){
    var $period = parseInt(Router.current().params.period)
    if ($period === -1){
      return true
    }
  },
  'periodExists': function (period){
    var $game = Router.current().params._id
    var all = GamePlayed.findOne({gameId: $game, period: period}, {sort: {coins: -1}});
    if (period === -1){
      var all = GamePlayed.findOne({gameId: $game}, {sort: {coins: -1}});
    }
    return all
  }
});

Template.gameLeaderboard.events({
  'click .item.quarter': function (e, t){
    var selected = e.target.id
    var gameId = Router.current().params._id
    Router.go('/leaderboard/' + gameId + "/" + selected)
  }
});

Template.miniLeaderboard.helpers({
	'userNotInLeaderboard': function(number){
    if (!number){
      var number = Router.current().params.count
      number = parseInt(number)
    }
		var userId = Meteor.userId()
		var $game = Router.current().params._id
    var $period = parseInt(Router.current().params.period)
    if (!$period) {
        var $period = Games.findOne({_id: $game}).period
    }
    if ($period > 0) {
      var all = GamePlayed.find({gameId: $game, period: $period}, {sort: {coins: -1}}).fetch();
    } else {
      var all = GamePlayed.find({gameId: $game}, {sort: {coins: -1}}).fetch();
    }

    var leaderboard = all.map(function(x) {
      var thisUser = {userId: x.userId, coins: x.coins}
      return thisUser;
    });
    var spot = _.indexOf(_.pluck(leaderboard, 'userId'), userId);

    var userSpot = leaderboard[spot]
    if (userSpot){
      userSpot.spot = spot + 1
    }

		if(spot > number){
			return userSpot;
		}

	},
  'player': function(number){
    if (!number){
      var number = parseInt(-1)
    }

    var $game = Router.current().params._id
    var $period = parseInt(Router.current().params.period)
    if (!$period) {
        var $period = Games.findOne({_id: $game}).period
    }

		var leaderboardList = function(list){
			var fixed = _.sortBy(list, function(obj){return - obj.coins})
			var rank = _.first(fixed, number)
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

    if($period === -1){
      var list = GamePlayed.find({gameId: $game}, {sort: {coins: -1} }).fetch();
    } else {
      var list = GamePlayed.find({gameId: $game, period: $period}, {sort: {coins: -1}}).fetch();
    }
		var filter = Session.get('leaderboardFilter');

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
				console.log(list, following);
				return leaderboardList(list)
				break;

			case "group":
				var groupId = Session.get('leaderboardGroupId');
				var group = Groups.findOne({_id: groupId});
				var members = group.members
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
  gameCoins: function () {
    var userId = Meteor.userId();
    var $game = Router.current().params._id
    var $period = parseInt(Router.current().params.period)
    if($period === -1){
      var list = GamePlayed.findOne({userId: userId, gameId: $game}).coins;
    } else {
      var list = GamePlayed.findOne({userId: userId, gameId: $game, period: $period}).coins;
    }
    return list;
  },
});
