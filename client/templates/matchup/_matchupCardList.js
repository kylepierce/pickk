Template.matchupCardList.helpers({
  matchups: function(){
    if(this.type === "league"){
      var selector = {leagueId: this.leagueId};
    } else if(this.type === "game") {
      var selector = {gameId: this.gameId};
    }
    return Matchup.find(selector);
  },
});

Template.matchupCardList.events({
  'click [data-action=view-matchups]': function(e, t){
    if(this.type === "game"){
      var selector = "gameId=" + this.gameId
    } else if (this.type === "league"){
      var selector = "leagueId=" + this.leagueId
    }
    Router.go('/matchup?' + selector);
  }
});
