Template._leaderboardCard.helpers({

});

Template._leaderboardCard.events({
  'click [data-action=game-leaderboard]': function(e, t){
    console.log(this);
    // analytics.track("waiting-leaderboard", {
    //   userId: userId,
    //   gameId: gameId,
    // });
    Router.go('/leaderboard?type=' + this.data.type + '&_id=' + this.data._id)
  },
});
