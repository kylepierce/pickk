Template.matchupCardList.onCreated(function(){
  if(this.data.type === "league"){
    var selector = {leagueId: this.data.leagueId};
  } else if(this.data.type === "game") {
    var selector = {gameId: this.data.gameId};
  }
  this.subscribe('listOfMatchups', selector)
});

Template.matchupCardList.helpers({
  matchupCount: function(){
    var count = Matchup.find().count();
    if(count > 0){
      return true
    }
  },
  matchups: function(){
    return Matchup.find();
  },
});

Template.matchupCardList.events({
  'click [data-action=view-matchups]': function(e, t){
    var data = {
      location: this.type,
      type: "Matchup",
    }
    if(this.type === "game"){
      var selector = "gameId=" + this.gameId
      data.gameId = this.gameId
    } else if (this.type === "league"){
      var selector = "leagueId=" + this.leagueId
      data.leagueId = this.leagueId
    }
    analytics.track("View More - List Item In Card", data);
    Router.go('/matchup?' + selector);
  }
});
