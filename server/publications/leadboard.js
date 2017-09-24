Meteor.publish('weekLeaderboard', function(data){
	check(data, Object);
	this.unblock()
	var users = Meteor.call('loadWeekLeaderboard', data);

	var newArray = []
	users.forEach(function (post) {
		newArray.push(post.user)
	});

	return UserList.find({_id: {$in: newArray}}, {fields: {_id: 1, avatar: 1, services: 1, 'profile.username': 1}})
});

Meteor.publish('singleGamePlayedIn', function (game, userId){
  check(game, String);
  check(userId, String);
  var selector = {gameId: game, userId: userId}
  return GamePlayed.find(selector);
});

// Meteor.publish("userRank", function(o, usersCoins) {
//   check(o, Match.Maybe(Object));
// 	check(usersCoins, Match.Maybe(Number));
//   this.unblock()
// 	var selector = {gameId: o.gameId, period: o.period, coins: {$gte:  usersCoins}}
//
// 	var sort = {sort: {coins: -1}}
// 	var fields = {fields: {userId: 1, gameId: 1, coins: 1, period: 1}}
//
// 	if (!o.filter){
// 		o.filter = "All"
// 	} else if (o.filter) {
// 		o.filter = o.filter.toLowerCase();
// 		switch (o.filter) {
// 			case "live":
// 				selector.type = "live"
// 				break;
//
// 			case "drive":
// 				selector.type = "drive"
// 				break;
//
// 			case "followers":
// 				var user = UserList.find({_id: this.userId}).fetch()
// 				var followers = user[0].profile.followers
// 				selector.userId = {$in: followers}
// 				break;
//
// 			case "following":
// 				var user = UserList.find({_id: this.userId}).fetch()
// 				var following = user[0].profile.following
// 				selector.userId = {$in: following}
// 				break;
//
// 			case "group":
// 				var groupId = o.groupId;
// 				var group = Groups.findOne({_id: o.groupId});
// 				var members = group.members
// 				selector.userId = {$in: members}
// 				break;
//
// 			case "matchup":
// 				var matchupId = o.matchupId;
// 				var matchup = Matchup.findOne({_id: o.matchupId});
// 				var members = matchup.users
// 				selector.userId = {$in: members}
// 				break;
// 		}
// 	}
//
// 	if (o.period) { selector.period = parseInt(o.period) }
//   Counts.publish(this, "userRank", GamePlayed.find(selector, sort, fields));
// });

// Meteor.publish('leaderboardGamePlayed', function(o) {
//   check(o, Object);
//   this.unblock()
// 	var selector = {gameId: o.gameId}
// 	var sort = {sort: {coins: -1}}
//   var fields = {fields: {userId: 1, gameId: 1, coins: 1, period: 1, queCounter: 1, type: 1, diamonds: 1}}
//
// 	if (!o.filter){
// 		o.filter = "All"
// 	} else if (o.filter) {
// 		o.filter = o.filter.toLowerCase();
// 		switch (o.filter) {
// 			case "live":
// 				selector.type = "live"
// 				break;
//
// 			case "drive":
// 				selector.type = "drive"
// 				break;
//
// 			case "followers":
// 				var user = UserList.find({_id: this.userId}).fetch()
// 				var followers = user[0].profile.followers
// 				selector.userId = {$in: followers}
// 				break;
//
// 			case "following":
// 				var user = UserList.find({_id: this.userId}).fetch()
// 				var following = user[0].profile.following
// 				selector.userId = {$in: following}
// 				break;
//
// 			case "group":
// 				var groupId = o.groupId;
// 				var group = Groups.findOne({_id: o.groupId});
// 				var members = group.members
// 				selector.userId = {$in: members}
// 				break;
//
// 			case "matchup":
// 				var matchupId = o.matchupId;
// 				var matchup = Matchup.findOne({_id: o.matchupId});
// 				var members = matchup.users
// 				selector.userId = {$in: members}
// 				break;
// 		}
// 	}
//
// 	if (o.period) { selector.period = parseInt(o.period) }
//   if (o.number) { sort.limit = parseInt(o.number) }
//
//   var gamesPlayed = GamePlayed.find(selector, sort, fields);  return gamesPlayed
// });

Meteor.publish('leaderboardGamePlayed', function(gameId, period, limit) {
	check(gameId, String);
	check(period, Number);
	check(limit, Number);

	var data = GamePlayed.find({gameId: gameId, period: period}, {sort: {coins: -1}, limit: limit, fields: {userId: 1, coins: 1}});

	if (data) {
		return data
	}
	return this.ready();
});

Meteor.publish('leaderboardUserList', function(list) {
	check(list, Array);

	var data = UserList.find({_id: {$in: list}}, {fields: {profile: 1}});

	if (data) {
		return data
	}
	return this.ready();
});

Meteor.publish("reactiveLeaderboard", function(selector) {
	var newSelector = {
		gameId: {$in: [selector.gameId]},
		period: {$in: selector.period},
	}
	// var limit = selector.limit

	if (selector.matchupId){
		var matchup = Matchup.findOne({_id: selector.matchupId});
		newSelector.userId = {$in: matchup.users}
		newSelector.period = {$in: matchup.period}
		newSelector.gameId = {$in: matchup.gameId}

	} else if (selector.leagueId){
		var matchup = Matchup.findOne({_id: selector.matchupId});
		newSelector.userId = {$in: matchup.users}
	}

	ReactiveAggregate(this, GamePlayed, [

		{$match: newSelector},
		{
	    $group: {
	        '_id': '$userId',
	        'coins': {
	            $sum: '$coins'
	        },
	    }
	},
	{$sort : {"coins": -1}},
	{
    $project: {
				userId: '$userId',
        coins: '$coins',
    }
	}], { clientCollection: "leaderboard" });
});
