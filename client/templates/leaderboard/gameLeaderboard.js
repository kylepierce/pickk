Leaderboard = new Meteor.Collection('leaderboard');

Template.gameLeaderboard.helpers({
	gameSelected: function () {
		var data = Session.get('leaderboardData');
		if (data.type === "game") {
			return true
		}
	},
	typeOfLeaderboard: function(){
		var data = Session.get('leaderboardData');
		return data.type
	},
	data: function(){
		var gameId = Router.current().params._id
		var query = Router.current().params.query
		var existing = Session.get('leaderboardData');

		var obj = {
			limit: 30
		}
		if (query.type){obj.type = query.type}
		if (query._id){obj._id = query._id}
		if (query.multipleGames) { obj.gameId = query.multipleGames.split(',')}
		else if (query.gameId){
			obj.gameId = [query.gameId]
		} else {
			obj.gameId = [query._id]
		}
		if (query.playType){obj.playType = query.playType}
		if (query.period){obj.period = [parseInt(query.period)]}
		if (query.periods) {
			var list = query.periods.split(',');
			var list = _.map(list, function(item){
				return parseInt(item);
			});
			obj.period = list
		}

		if(!obj.period){
			obj.period = [0, 1, 2, 3, 4, 5]
		}

		var all = _.extend(existing, obj)
		return obj
	}
});

Template.miniLeaderboard.onCreated(function(){
	var templateData = this.data.data
	var self = this
	var limit = templateData.limit
	Session.set('leaderboardData', templateData);

	self.getUsers = function(){
		return Leaderboard.find({}, {sort: {coins: -1}, limit: limit}).map(function(player, index){
			return player._id
		});
	}

	self.getSelector = function(){
		var data = Session.get('leaderboardData');
		return Session.get('leaderboardData');
	}
	self.autorun(function() {
		var leaderboard = self.subscribe('reactiveLeaderboard', self.getSelector());
		var users = self.subscribe('leaderboardUserList', self.getUsers());
	});
});

Template.miniLeaderboard.helpers({
	'leaderboard': function(){
		var count = Leaderboard.find({}).count();
		if(count > 0){
			return true
		}
	},
	'limit': function(){
		return _.map(_.range(this.data.limit), function (index) {
			return {number: index}
		});
	},
	'players': function(){
		var templateData = this.data
		if (templateData && templateData.limit){
			var limit = templateData.limit

			var leaderboard = Leaderboard.find({}, {sort: {coins: -1}, limit: limit}).fetch();
			return leaderboard
		}
	}
});

Template.miniLeaderboard.events({
	'click [data-action=game-leaderboard]': function (e, t) {
		// analytics.track("waiting-leaderboard", {
		//   userId: userId,
		//   gameId: gameId,
		// });
		var params = 'type=' + this.data.type + '&_id=' + this.data._id
		if(this.live){
			params = params + "&periods=" + this.data.period[0]
		}
		var data = {
			location: this.data.type,
			type: "Leaderboard",
			gameId: this.data._id,
			period: this.data.period[0]
		}
		analytics.track("View More - List Item In Card", data);
		Router.go('/leaderboard?' + params)
	},
	'click [data-action=viewPlayer]': function(e,t){
		Router.go('/user-profile/'+this.player._id)
	}
});

Template.leaderboardList.helpers({
	'players': function () {
		var templateData = this.data
		if (templateData && templateData.limit) {
			var limit = templateData.limit

			var leaderboard = Leaderboard.find({}, { sort: { coins: -1 }, limit: limit }).fetch();
			return leaderboard
		}
	}
});

Template.singlePlayerLeader.helpers({
	username: function(id){
		var user = UserList.findOne({_id: id});
		if(user){
			return user.profile.username
		}
	}
});
















// Template.gameLeaderboard.onCreated(function() {
// 	var gameId = Router.current().params._id
// 	var query = Router.current().params.query
// 	var data = {
// 		gameId: gameId,
// 		period: query.period,
// 		filter: query.filter,
// 		groupId: query.groupId,
// 		matchupId: query.matchupId
// 	}
// 	if (data.period === undefined){
// 		var game = Games.findOne();
//     var period = game.period;
// 		data["period"] = period
// 	}
// 	Session.set('leaderboardData', data);
// });
//
// Template.gameLeaderboard.helpers({});
//
// Template.gameLeaderboard.events({});
//
// Template.miniLeaderboard.onCreated(function() {
// 	var t = Template.instance()
// 	var self = this;
// 	var data = Session.get('leaderboardData');
// 	self.getPeriod = function () {
// 		// if (this.data.game.period){
// 		// 	return this.data.game.period
// 		// } else {
// 			return parseInt(data.period)
// 		// }
// 	};
// 	var limit = this.data.i;
// 	// self.userCoins = function () {
// 	//   return Session.get('userCoins');
// 	// };
//
// 	self.autorun(function() {
// 	// 	self.subscribe( 'userRank', self.getFilter(), self.userCoins());
// 		self.subscribe( 'leaderboardGamePlayed', data.gameId, self.getPeriod(), limit);
// 	// 		$( ".player-holder" ).delay( 100 ).fadeOut( 'slow', function() {
// 	//       $( ".loading-wrapper" ).fadeIn( 'slow' );
// 	// 		});
// 	// 	});
// 	});
// });
//
// Template.miniLeaderboard.onRendered( function() {
//   $( "svg" ).delay( 50 ).fadeIn();
// });
//
// Template.miniLeaderboard.helpers({
// 	// 'userNotInLeaderboard': function(number){
// 	// 	// var count = Counts.get('userRank');
// 	// 	// var data = Session.get('leaderboardData');
// 	// 	var selector = {userId: Meteor.userId(), gameId: data.gameId, period: data.period}
// 	// 	var game = GamePlayed.findOne(selector);
// 	//
// 	// 	if( game ){
// 	// 		Session.set('userCoins', game.coins);
// 	// 		if (number === -1) {
// 	// 			return false
// 	// 		} else if(count > number){
// 	// 			game.rank = count
// 	// 			return game
// 	// 		}
// 	// 	}
// 	// },
//   'players': function(number){
// 		var userId = Meteor.userId();
// 		// var ranking = Counts.get('userRank');
// 		// var data = Session.get('leaderboardData');
//     // var following = Meteor.user().profile.following
//     var list = GamePlayed.find({}, {sort: {coins: -1}}).fetch();
// 		// var filter = data.filter && data.filter.toLowerCase();
// 		// var types = ["live", "drive"]
// 		// Only load number GamePlayed from template.
// 		// data.number = number
// 		// Session.set('leaderboardData', data);
// 		return list
//   }
// });
//
// Template.miniLeaderboard.events({
// 	"click .leaderboard-item": function(e, t){
// 		 Router.go("/user-profile/" + this.userId)
// 	}
// });
//
// Template.singlePlayer.helpers({
// 	'username': function(userId) {
// 		var user = UserList.findOne({_id: userId});
// 		if(user){
// 			return user.profile.username
// 		}
// 	},
// 	'following': function(){
// 		if(this.following){
// 			return "following"
// 		}
// 	},
// 	'thisUser': function(){
// 		var userId = Meteor.userId();
// 		if(this.userId === userId){
// 			return "history-inprogress"
// 		}
// 	},
// 	'pathUrl': function () {
// 		// https://github.com/meteoric/meteor-ionic/issues/66
// 		var url = "/user-profile/" + this.userId
// 		return url
// 	},
// });

// Template.gameLeaderboard.onCreated(function() {
// 	var filter = Router.current().params.query.filter
// 	var query = Router.current().params.query
// 	var gameId = Router.current().params._id
// 	// var leagueId = Router.current().params.leagueId
// 	//If there is no new data
// 	// var data = Session.get('singleLeaderboard');
// 	// var noNewData = _.isEmpty(data);
//
// 	// if(noNewData || !data) {
// 	// 	if(!query) {
// 	// 		var data = {}
// 	// 	} else if (leagueId){
// 	// 		var data = {
// 	// 			filter: "league",
// 	// 			leagueId: leagueId
// 	// 		}
// 	// 	} else {
// 	// 		var data = query
// 	// 	}
// 	// }
// 	// data.gameId = gameId
// 	console.log(gameId);
// 	// Session.set('singleLeaderboard', data);
//
// 	var self = this;
// 	self.getFilter = function () {
// 		var obj = {
// 			gameId: gameId
// 		}
// 		return obj
// 		// return Session.get('singleLeaderboard');
// 	}
// 	self.autorun(function() {
// 		self.subscribe( 'gameLeaderboard', self.getFilter(), function(){
// 			$( ".loader-holder" ).delay( 500 ).fadeOut( 'slow', function() {
// 	      $( ".loading-wrapper" ).fadeIn( 'slow' );
// 			});
// 		});
// 	});
// });
//
// Template.gameLeaderboard.onRendered( function() {
//   $( "svg" ).delay( 250 ).fadeIn();
// });
//
// Template.gameLeaderboard.helpers({
// 	'players': function(){
// 		var following = Meteor.user().profile.following
// 		var leaderboardList = function(list){
// 			var fixed = _.sortBy(list, function(obj){return - obj.diamonds})
// 			var rank = _.first(fixed, 25)
// 			var i = 1
// 			_.map(rank, function(user){
// 				var isFollowingUser = following.indexOf(user._id)
// 				if(isFollowingUser >= 0){
// 					user.following = true
// 				}
// 				user.rank = i
// 				i++
// 			});
// 			return rank
// 		}
//
// 		var shortList = function(all, array){
// 			var list = _.filter(all, function(user){
// 				var onTheList = array.indexOf(user._id)
// 				if (onTheList !== -1){
// 					return user
// 				}
// 			});
// 		return list
// 		}
//
// 		var data = Session.get('leaderboardFilter');
// 		Fetcher.retrieve("gameLeaderboard", "loadWeekLeaderboard", data)
// 		var leaderboard = Fetcher.get("gameLeaderboard");
//
// 		// Only show the results from the filters
// 		switch (data.filter) {
// 			case "All":
// 				return leaderboardList(leaderboard)
// 				break;
//
// 			case "Followers":
// 				var followers = Meteor.user().profile.followers
// 				var list = shortList(leaderboard, followers)
// 				return leaderboardList(list)
// 				break;
//
// 			case "Following":
// 				var following = Meteor.user().profile.following
// 				var list = shortList(leaderboard, following)
// 				return leaderboardList(list)
// 				break;
//
// 			case "league":
// 				var leagueId = data.leagueId
// 				var league = Groups.findOne({_id: leagueId});
// 				var members = league.members
// 				var list = shortList(leaderboard, members)
// 				return leaderboardList(list)
// 				break;
//
// 			default:
// 				return leaderboardList(leaderboard)
// 				break;
// 		}
// 	},
// 	// 'date': function() {
// 	//   var startDay = moment().day("Tuesday").week(date)._d;
// 	// 	var endDay = moment().day("Monday").week(date+1)._d;
// 	// 	var startDay = moment(startDay).format("MMM Do")
// 	// 	var endDay = moment(endDay).format("MMM Do")
// 	//
// 	//   return startDay + " - " + endDay
// 	// },
// });

// Template.singlePlayerLeader.helpers({
// 	'username': function(userId){
// 		var user = UserList.findOne({_id: userId})
// 		if(user){
// 			return user.profile.username
// 		}
// 	},
// 	'following': function(){
// 		if(this.player.following){
// 			return "following"
// 		}
// 	},
// 	'thisUser': function(){
// 		var userId = Meteor.userId()
// 		if(this.userId === userId){
// 			return "history-inprogress"
// 		}
// 	},
// });

// Template.gameLeaderboard.events({
// 	"click .leaderboard-item": function(e, t){
// 		 Router.go("/user-profile/" + this.player._id)
// 	}
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
// });
