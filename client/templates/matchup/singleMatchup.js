Template.singleMatchup.onCreated(function() {

});

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
  'matchupName': function(matchup){
    var groupId = matchup.groupId

    if(groupId){
      Meteor.subscribe('singleGroup', groupId);
      var group = Groups.find({_id: groupId}).fetch();
      var matchupName = group[0].name
    } else {
      var userId = matchup.commissioner
      var user = UserList.find({_id: userId}).fetch()
      var matchupName = user[0].profile.username
    }
    return matchupName
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
  },
  'limitNum': function(){
    if(this.limitNum === -1){
      return "∞"
    } else {
      return this.limitNum
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

Template.matchupJoin.helpers({
  allowToJoin: function(){
    var userId = Meteor.userId();
    if(this.groupId){
      Meteor.subscribe('singleGroup', this.groupId);
      var group = Groups.find({_id: this.groupId}).fetch()
      var isMember = group[0].members.indexOf(userId)
      if(isMember > -1){
        return true
      }
    } else if (this.secret === "invite"){
      var invited = this.invites.indexOf(userId)
      if(invited > -1){
        return true
      }
    } else {
      return true
    }
  }
});
