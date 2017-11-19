Template.historyCardList.onCreated(function(){
  this.subscribe('gameQuestionCount', this.data.gameId)
});

Template.historyCardList.helpers({
  userPlayed: function(){
    var count = Counts.get('gameQuestionCount');
    if (count > 0){
      return true
    } else {
      return false
    }
  }
});

Template.historyCardList.events({
  // 'click [data-action=previous-answers]': function(e, t){
  //   var gameId = this.gameId
  //   analytics.track("waiting-history", {
  //     userId: Meteor.userId(),
  //     gameId: gameId,
  //   });
  //   Router.go('/history/' + gameId );
  // },
});
