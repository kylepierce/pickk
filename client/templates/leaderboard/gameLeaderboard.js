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
	Session.set('leaderboardData', data)
});

Template.gameLeaderboard.helpers({});

Template.gameLeaderboard.events({});

Template.miniLeaderboard.onCreated(function() {
	this.getFilter = () => Session.get('leaderboardData');
	this.userCoins = () => Session.get('userCoins');
	this.autorun(() => {
		this.subscribe( 'userRank', this.getFilter(), this.userCoins());
		this.subscribe( 'leaderboardGamePlayed', this.getFilter(), function(){
			$( ".loader-holder" ).delay( 500 ).fadeOut( 'slow', function() {
	      $( ".loading-wrapper" ).fadeIn( 'slow' );
			});
		});
	});
});

Template.miniLeaderboard.onRendered( function() {
  $( "svg" ).delay( 250 ).fadeIn();
});

Template.miniLeaderboard.helpers({
	'userNotInLeaderboard': function(number){
		var count = Counts.get('userRanking')
		var data = Session.get('leaderboardData')
		var selector = {userId: Meteor.userId(), gameId: data.gameId, period: data.period}
		var game = GamePlayed.findOne(selector)

		if( game ){
			Session.set('userCoins', game.coins)
			if (number === -1) {
				return false
			} else if(count > number){
				game.rank = count
				return game
			}
		}
	},
	'rank': function(){
		// We know the users current score. Lets find the number of user with more or equal than us.
		var count = Counts.get('userRanking')
		return count
	},
  'player': function(number){
		var userId = Meteor.userId()
		var data = Session.get('leaderboardData')
    var following = Meteor.user().profile.following
    var list = GamePlayed.find({}).fetch();
		if (data.number){
			data.number = number
			Session.set('leaderboardData', data)
		}

		var leaderboardList = function(list){
			var fixed = _.sortBy(list, function(obj){return - obj.coins})
			var i = 1

			var leaderboardList = _.each(fixed, function(user){
				var isFollowingUser = following.indexOf(user.userId)
				if(isFollowingUser !== -1){
					user.following = true
				}
				user.rank = i
				i = i + 1
			});
			return fixed
		}

    return leaderboardList(list)
  },
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

Template.miniLeaderboard.events({
	"click .leaderboard-item": function(e, t){
		 Router.go("/user-profile/" + this.userId)
	}
});
