Template.postGame.helpers({
  data: function(){
    var obj = {
      type: "game",
      _id: this.game._id,
			gameId: [this.game._id],
      limit: 3
    }
    return obj
  }
});
