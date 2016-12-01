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
    console.log($period)
    if ($period > 0) {
      var all = GamePlayed.find({gameId: $game, period: $period}, {sort: {coins: -1}}).fetch();
    } else {
      console.log("Ohhhh hello")
      var all = GamePlayed.find({gameId: $game}, {sort: {coins: -1}}).fetch();
    }
    
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
      var number = parseInt(0)
    }

    var $game = Router.current().params._id
    var $period = parseInt(Router.current().params.period)
    if($period === -1){
      var list = GamePlayed.find({gameId: $game}, {sort: {coins: -1}, limit: number}).fetch();
    } else {
      var list = GamePlayed.find({gameId: $game, period: $period}, {sort: {coins: -1}, limit: number}).fetch();
    }
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
    if($period === -1){
      var list = GamePlayed.findOne({userId: userId, gameId: $game}).coins;
    } else {
      var list = GamePlayed.findOne({userId: userId, gameId: $game, period: $period}).coins;
    }
    return list;
  },
});