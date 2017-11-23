Template.postGame.helpers({
  data: function(){
    var obj = {
      type: "game",
      _id: this.game._id,
      gameId: [this.game._id],
      period: [0, 1, 2, 3, 4, 5],
      limit: 3
    }
    return obj
  }
});
