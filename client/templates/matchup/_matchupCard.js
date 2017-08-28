Template.matchupCard.helpers({
  'joined': function(){
    var userId = Meteor.userId();
    var alreadyJoined = this.m.users.indexOf(userId)
    if(alreadyJoined > -1){
      return "joined"
    }
  },
  'commissioner': function(matchup){
    var groupId = matchup.groupId

    if(groupId){
      Meteor.subscribe('singleGroup', groupId);
      var group = Groups.find({_id: groupId}).fetch();
      var commissioner = group[0].name
    } else {
      var userId = matchup.commissioner
      Meteor.subscribe('findSingle', userId);
      var user = UserList.findOne({_id: userId});
      if( user ){
        var commissioner = user.profile.username
      }
    }
    return commissioner
  },
  'group': function(){
    if(this.m.secret === "group"){
      return true
    }
  },
  'groupName': function(groupId){
    Meteor.subscribe('singleGroup', groupId);
    var group = Groups.findOne({_id: groupId})
    if (group){
      return group.name
    }
  },
  'username': function(ref) {
		Meteor.subscribe('findSingle', ref);
    var user = UserList.findOne({_id: ref})
    if (user){
      return user.profile.username
    }
	},
  'gameName': function(gameId){
    Meteor.subscribe('singleGameData', gameId);
    var game = Games.findOne({_id: gameId})
    if (game){
      return game.name
    }
  },
  'users': function (userArray){
    return userArray.length
  },
  'limitNum': function(number){
    if(number === -1){
      return "∞"
    } else {
      return number
    }
  }
});

Template.matchupCard.events({
  'click [data-action=viewMatchup]': function(e,t){
    Router.go('/matchup/'+ this.m._id)
  }
});
