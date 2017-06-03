Template.gameLeaderboard.onCreated(function() {
	var gameId = Router.current().params._id
	var query = Router.current().params.query
	var data = {
		gameId: gameId,
		period: query.period,
		filter: query.filter,
		groupId: query.groupId,
		matchupId: query.matchupId
	}
	if (data.period === undefined){
		var game = Games.find().fetch();
    var period = game[0].period;
		data["period"] = period
	}
	Session.set('leaderboardData', data);
});

Template.gameLeaderboard.helpers({});

Template.gameLeaderboard.events({});

Template.miniLeaderboard.onCreated(function() {
	var self = this;

	self.getFilter = function () {
	  return Session.get('leaderboardData');
	};
	self.userCoins = function () {
	  return Session.get('userCoins');
	};

	self.autorun(function() {
		self.subscribe( 'userRank', self.getFilter(), self.userCoins());
		self.subscribe( 'leaderboardGamePlayed', self.getFilter(), function(){
			$( ".player-holder" ).delay( 100 ).fadeOut( 'slow', function() {
	      $( ".loading-wrapper" ).fadeIn( 'slow' );
			});
		});
	});
});

Template.miniLeaderboard.onRendered( function() {
  $( "svg" ).delay( 50 ).fadeIn();
});

Template.miniLeaderboard.helpers({
	'userNotInLeaderboard': function(number){
		var count = Counts.get('userRank');
		var data = Session.get('leaderboardData');
		var selector = {userId: Meteor.userId(), gameId: data.gameId, period: data.period}
		var game = GamePlayed.findOne(selector);

		if( game ){
			Session.set('userCoins', game.coins);
			if (number === -1) {
				return false
			} else if(count > number){
				game.rank = count
				return game
			}
		}
	},
  'player': function(number){
		var userId = Meteor.userId();
		var ranking = Counts.get('userRank');
		var data = Session.get('leaderboardData');
    var following = Meteor.user().profile.following
    var list = GamePlayed.find().fetch();
		var filter = data.filter && data.filter.toLowerCase();
		var types = ["live", "drive"]

		// Only load number GamePlayed from template.
		data.number = number
		Session.set('leaderboardData', data);

	  return _.sortBy(list, function(u, i){
			var i = i + 1
			// Are they someone we follow?
			if(following.indexOf(u.userId) > -1){  u.following = true }
			if (u.userId === userId && ranking > number){
				u.rank = ranking
			}
			return - u.coins // Invert the order of the list.
		});

  }
});

Template.miniLeaderboard.events({
	"click .leaderboard-item": function(e, t){
		 Router.go("/user-profile/" + this.userId)
	}
});

Template.singlePlayer.onCreated(function() {
	var self = this;

	self.getFilter = function () {
		return Session.get('leaderboardData');
	};
	self.userCoins = function () {
		return Session.get('userCoins');
	};

	self.autorun(function() {
		self.subscribe( 'userRank', self.getFilter(), self.userCoins());
		self.subscribe( 'leaderboardGamePlayed', self.getFilter(), function(){
			$(".not-legit" ).delay( 500 ).fadeTo( 'slow', 0, function() {
				$( ".legit" ).fadeTo( 'slow', 1);
				$(".not-legit").remove();
			});
		});
	});
});


Template.singlePlayer.helpers({
	'username': function(userId) {
		var user = UserList.findOne({_id: userId});
		if(user){
			return user.profile.username
		}
	},
	'following': function(){
		if(this.following){
			return "following"
		}
	},
	'thisUser': function(){
		var userId = Meteor.userId();
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
