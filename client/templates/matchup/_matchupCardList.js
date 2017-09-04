Template.matchupCardList.helpers({
  matchups: function(){
    if(this.type === "league"){
      var leagueId = this.data.league._id
      var selector = {groupId: leagueId};
    } else {

    }
    var matchups = Matchup.find(selector);
    return matchups
  },
});
