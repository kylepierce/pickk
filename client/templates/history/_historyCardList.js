Template.historyCardList.helpers({

});

Template.historyCardList.events({
  'click [data-action=previous-answers]': function(e, t){
    var gameId = this.gameId
    analytics.track("waiting-history", {
      userId: Meteor.userId(),
      gameId: gameId,
    });
    Router.go('/history/' + gameId );
  },
});
