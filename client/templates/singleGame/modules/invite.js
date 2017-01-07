// Template.inviteToPlay.onCreated(function(){
//   console.log(this);
//   this.data.rewards = new ReactiveVar();
// });

Template.inviteToPlay.helpers({
  // rewards: function () {
  //   Branch.loadRewards().then(function (rewards) {
  //     console.log(rewards);
  //     Template.instance().data.rewards.set(rewards)
  //     // Template.data.rewards.set( rewards );
  //   });
  //   var number = Template.instance().data.rewards.get();
  //   console.log(number);
  //   return number
  // },
  listToShare: function(){
    var followers = Meteor.user().profile.followers
    var game = Games.findOne({})
    var invited = game.invited
    var users = game.users
    // Compare the users in the array against the already invited
    var list = _.reject(followers, function(user){
      if (invited.indexOf(user) !== -1 || users.indexOf(user) !== -1){
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
    var users = game.users
    // Compare the users in the array against the already invited
    var list = _.reject(followers, function(user){
      if (invited.indexOf(user) !== -1 || users.indexOf(user) !== -1){
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
    Meteor.call("inviteToGame", gameId, userId)
  },
  "click [data-action=textInvite]": function(e, t){
    if(Meteor.isCordova){
      var branchUniversalObj = null;
      var ref = Meteor.userId()
      var username = Meteor.user().profile.username
      var gameId = t.data.game[0]._id
      var game = Games.findOne({_id: gameId})
      var gameName = game.name
      var message = 'Predict the Next Play on Pickk! I Challenge You to Prove Your Sports Knowledge in the ' + gameName + ' game!'

      Branch.createBranchUniversalObject({
        canonicalIdentifier: 'user-profile/'+ ref,
        title: 'Live Game Challenge!',
        contentDescription: message,
        contentMetadata: {
          'userId': ref,
          'userName': username,
          'gameId': gameId
        }
      }).then(function (newBranchUniversalObj) {
        branchUniversalObj = newBranchUniversalObj;
        branchUniversalObj.showShareSheet({
          // put your link properties here
          "feature" : "share",
        }, {
          // put your control parameters here
          "$deeplink_path" : "/game/" + gameId,
        }, message);
      });
    }
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
