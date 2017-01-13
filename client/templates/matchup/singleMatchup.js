Template.singleMatchup.onCreated(function() {

});

Template.singleMatchup.rendered = function() {
    console.log(this.data); // you should see your passage object in the console
};

Template.singleMatchup.helpers({
  matchup: function(){
    return Matchup.findOne();
  },
  'users': function (userArray){
    return userArray.length
  },
  'username': function(ref) {
		Meteor.subscribe('findSingle', ref);
		return UserList.findOne({_id: ref}).profile.username
	},
  'gameName': function(gameId){
    Meteor.subscribe('singleGameData', gameId);
    var game = Games.findOne({_id: gameId})
    if (game){
      return game.name
    }
  },
  'alreadyJoined': function(users){
    var userId = Meteor.userId();
    var onList = users.indexOf(userId)
    if(onList >= 0){
      return true
    }
  }
});

Template.singleMatchup.events({
  'click [data-action=joinMatchup]': function(e, t){
    var matchupId = this._id
    var userId = Meteor.userId()
    Meteor.call('joinMatchup', matchupId, userId);
  },
  'click [data-action=leaveMatchup]': function(e, t){
    var matchupId = this._id
    var userId = Meteor.userId()
    Meteor.call('leaveMatchup', matchupId, userId);
  }
});
