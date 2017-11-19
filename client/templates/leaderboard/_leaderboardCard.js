Template._leaderboardCard.onCreated(function () {
  var templateData = this.data.data
  var self = this
  var limit = templateData.limit

  self.getUsers = function () {
    return Leaderboard.find({}, { sort: { coins: -1 }, limit: limit }).map(function (player, index) {
      return player._id
    });
  }

  self.getSelector = function () {
    return templateData
  }
  self.autorun(function () {
    var leaderboard = self.subscribe('reactiveLeaderboard', self.getSelector());
    var users = self.subscribe('leaderboardUserList', self.getUsers());
  });
});

Template._leaderboardCard.helpers({
});

Template._leaderboardCard.events({

});
