Template.matchupCardList.onCreated(function(){
  if(this.data.type === "league"){
    var selector = {leagueId: this.data.leagueId};
  } else if(this.data.type === "game") {
    var selector = {gameId: this.data.gameId};
  }
  this.subscribe('listOfMatchups', selector)
});

Template.matchupCardList.helpers({
  matchups: function(){
    return Matchup.find();
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
