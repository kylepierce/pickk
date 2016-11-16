Template.adminControls.helpers({
	numberOfPlayers: function (array) {
		if (array){
			var number = array.length
    	return number
		}
  },

  endOfGame: function (game) {
    var status = game && game.close_processed
    if (status){
      return true
    }
  }
});