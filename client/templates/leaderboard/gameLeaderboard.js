Template.miniLeaderboard.helpers({
	'userNotInLeaderboard': function(number){
    // if (!number){
    //   var number = Router.current().params.count
    //   number = parseInt(number)
    // }
		var userId = Meteor.userId()
		var $game = Router.current().params._id
    var $period = parseInt(Router.current().params.period)
    var all = GamePlayed.find({gameId: $game}, {sort: {coins: -1}}).fetch();
    var leaderboard = all.map(function(x) {
      var thisUser = {userId: x.userId, coins: x.coins} 
      return thisUser; 
    });
    var spot = _.indexOf(_.pluck(leaderboard, 'userId'), userId);
    var userSpot = leaderboard[spot]
    userSpot.spot = spot + 1

		if(spot > number){
			return userSpot;
		}
		
	},
  'player': function(number){
    if (!number){
      var number = Router.current().params.count
      number = parseInt(number)
    }

    var $game = Router.current().params._id
    var $period = parseInt(Router.current().params.period)
    var list = GamePlayed.find({gameId: $game, period: $period}, {sort: {coins: -1}, limit: number}).fetch();
        console.log($game, $period, list)
    return list
  },
  'username': function(userId) {
    return UserList.findOne({_id: userId});
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
    return GamePlayed.findOne({userId: userId, gameId: $game, period: $period}).coins;
  },
});