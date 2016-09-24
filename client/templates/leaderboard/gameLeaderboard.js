Template.miniLeaderboard.helpers({
	'userNotInLeaderboard': function(number){
		check(number, Number);
		var userId = Meteor.userId()
		var $game = Router.current().params.id
    var all = GamePlayed.find({gameId: $game}, {sort: {coins: -1}}).fetch();

    var spot = all.map(function(x) {return x.userId; }).indexOf(userId);

		if(spot > 3){
			var thisUser = {userId: userId, spot: spot} 
			return thisUser;
		}
		
	},
  'player': function(number){
  	check(number, Number);
    var $game = Router.current().params.id
    var list = GamePlayed.find({gameId: $game}, {sort: {coins: -1}, limit: number}).fetch();
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
    var $game = Router.current().params.id
    return GamePlayed.findOne({userId: userId, gameId: $game}).coins;
  },
});