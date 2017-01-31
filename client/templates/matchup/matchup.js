Template.matchup.onCreated(function() {
  var previous = Session.get('matchupFilter');
  var query = Router.current().params.query
  var games = Games.find({}).fetch();
  var list = []
  _.each(games, function(game){
    list.push(game._id)
  });
  //secret, featured, size,
  if(query){
    var data = query
  } else if (previous) {
    var data = previous
  } else {
    var data = {}
  }
  if(!query.gameId){
    data.gameId = {$in: list}
  }
  var self = this;
  Session.set('matchupFilter', data)
	self.getFilter = function () {
    Session.get('matchupFilter');
  }
	self.autorun(function() {
		self.subscribe( 'upcomingMatchups', self.getFilter());
	});
});

Template.matchup.helpers({
  'anyMatchups': function(){
    var amount = Matchup.find().count();
    if(amount > 0){
      return true
    }
  },
  matchups: function(){
    return Matchup.find({})
  }
});

Template.matchup.events({

});

Template.matchupItem.helpers({
  'joined': function(){
    var userId = Meteor.userId();
    var alreadyJoined = this.m.users.indexOf(userId)
    if(alreadyJoined > -1){
      return "history-inprogress"
    }
  },
  'matchupName': function(matchup){
    var groupId = matchup.groupId

    if(groupId){
      Meteor.subscribe('singleGroup', groupId);
      var group = Groups.find({_id: groupId}).fetch();
      var matchupName = group[0].name
    } else {
      var userId = matchup.commissioner
      Meteor.subscribe('findSingle', userId);
      var user = UserList.findOne({_id: userId});
      if( user ){
        var matchupName = user.profile.username
      }
    }
    return matchupName
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

Template.matchupItem.events({
  'click .item': function(e,t){
    Router.go('/matchup/'+ this.m._id)
  }
});
