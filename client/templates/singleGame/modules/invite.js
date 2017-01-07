Template.inviteToPlay.helpers({
  listToShare: function(){
    var followers = Meteor.user().profile.followers
    var game = Games.findOne({})
    var invited = game.invited
    // Compare the users in the array against the already invited
    var list = _.reject(followers, function(user){
      if (invited.indexOf(user) !== -1){
        return user
      }
    });
    // Return 3 at a time
    if (list.length === 0){
      return false
    } else {
      return true
    }
  },
  followers: function(){
    var followers = Meteor.user().profile.followers
    var game = Games.findOne({})
    var invited = game.invited
    // Compare the users in the array against the already invited
    var list = _.reject(followers, function(user){
      if (invited.indexOf(user) !== -1){
        return user
      }
    });
    // Return 3 at a time
    if (list.length === 0){
      return false
    } else {
      return list
    }
  }
});

Template.inviteToPlay.events({
  "click [data-action=invite]": function(e, t){
    var gameId = t.data.game[0]._id
    var userId = e.currentTarget.value
    console.log(gameId, userId);
    Meteor.call("inviteToGame", gameId, userId)
  },
  "click [data-action=inviteAll]": function(e, t){
    var gameId = t.data.game[0]._id
    var followers = Meteor.user().profile.followers
    var game = Games.findOne({})
    var invited = game.invited
    // Compare the users in the array against the already invited
    var list = _.reject(followers, function(user){
      if (invited.indexOf(user) !== -1){
        return user
      }
    });
    _.each(list, function(userId){
      Meteor.call("inviteToGame", gameId, userId)
    });
  }
});
