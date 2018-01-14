Template.inviteToPlay.helpers({
  listToShare: function(){
    var followers = Meteor.user().profile.followers
    var game = Games.findOne({})
    var invited = game.invited
    var users = game.users
    var userDimissed = game.dismissed
    if (userDimissed){
      var userDimissed = game.dismissed.indexOf(Meteor.userId())
    } else {
      var userDimissed = -1
    }
    // Compare the users in the array against the already invited
    if(invited){
      var list = _.reject(followers, function(user){
        if (invited.indexOf(user) !== -1 || users.indexOf(user) !== -1){
          return user
        }
      });
    }

    // Return 3 at a time
    if (!list || list.length === 0 || userDimissed > -1){
      return false
    } else {
      return true
    }
  },
  followers: function(){
    var followers = Meteor.user().profile.followers
    var game = Games.findOne({});
    var invited = game.invited
    var users = game.users
    // Compare the users in the array against the already invited
    if(invited){
      var list = _.reject(followers, function(user){
        if (invited.indexOf(user) !== -1 || users.indexOf(user) !== -1){
          return user
        }
      });
    }
    // Return 3 at a time
    if (!list || list.length === 0){
      return false
    } else {
      return list.splice(0, 3)
    }
  }
});

Template.inviteToPlay.events({
  "click [data-action=dismiss]": function(e, t){
    var gameId = Games.findOne()._id
    var userId = Meteor.userId();
    analytics.track("dismiss invite", {
      userId: userId,
      gameId: gameId,
      dateCreated: new Date()
    });
    Meteor.call('dismissInvitePrompt', gameId, userId);
  },
  "click [data-action=invite]": function(e, t){
    var gameId = Games.findOne()._id
    var ref = Meteor.userId();
    var userId = e.currentTarget.value
    Meteor.call("inviteToGame", gameId, userId, ref);
  },
  "click [data-action=gameMatchup]": function(e, t){
    var gameId = t.data.game[0]._id
    Router.go('/matchup?gameId=' + gameId);
  },
  "click [data-action=textInvite]": function(e, t){
    if(Meteor.isCordova){
      var branchUniversalObj = null;
      var ref = Meteor.userId();
      var username = Meteor.user().profile.username
      var gameId = Games.findOne()._id
      var game = Games.findOne({_id: gameId})
      var gameName = game.name
      var message = 'Predict the Next Play on Pickk! I Challenge You to Prove Your Sports Knowledge in the ' + gameName + ' game!'

      analytics.track("invited to game", {
        userId: ref,
        type: 'share-sheet',
        location: 'waiting screen',
        gameId: gameId,
        dateCreated: new Date()
      });

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
    var gameId = Games.findOne()._id
    var ref = Meteor.userId();
    var followers = Meteor.user().profile.followers
    var game = Games.findOne({})
    var invited = game.invited
    // Compare the users in the array against the already invited
    var list = _.reject(followers, function(user){
      if (invited.indexOf(user) !== -1){
        return user
      }
    });

    analytics.track("invited all to game", {
      userId: ref,
      gameId: gameId,
      dateCreated: new Date()
    });

    _.each(list, function(userId){
      Meteor.call("inviteToGame", gameId, userId, ref)
    });
  }
});
