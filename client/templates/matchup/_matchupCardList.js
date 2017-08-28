Template.matchupCardList.helpers({
  matchups: function(){
    if(this.type === "league"){
      var leagueId = this.data.group[0]._id
      var selector = {groupId: leagueId};
    } else {

    }
    // var groupId = this.group[0]._id
    var matchups = Matchup.find(selector);
    return matchups
  },
});
