Template.postGame.helpers({
  data: function(){
    var obj = {
      gameId: this.game._id,
      period: [this.game.period],
      limit: 3
    }
    return obj
  }
});
