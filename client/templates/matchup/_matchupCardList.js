Template.matchupCardList.helpers({
  matchups: function(){
    if(this.type === "league"){
      var leagueId = this.data.league._id
      var selector = {leagueId: leagueId};
    } else if(this.type === "game") {
      var gameId = this.data.game._id
      var selector = {gameId: gameId};
    }
    var matchups = Matchup.find(selector);
    return matchups
  },
});

Template.matchupCardList.events({
  'click [data-action=view-matchups]': function(){
    var gameId = this.data.game._id;
    Router.go('/matchup?gameId=' + gameId);
  }
});
