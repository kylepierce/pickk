Template.singleGameHistory.helpers({
	notPrediction: function () {
		var game = Games.findOne({});
		if (game.type === "prediction" || game.type === "predictions"){
			return false
		} else {
			return true
		}
	}
});

Template.gameHistory.onCreated(function(){
	var $gameId = Router.current().params._id
	this.subscribe('questionsByGameId', $gameId, this.data.number, false);
});

Template.gameHistory.helpers({
	questions: function (number){
		return Questions.find({}, {sort: {dateCreated: -1}}).fetch()
	},
});

Template.gameHistory.events({
	'click': function(){
    IonModal.open('questionDetails', this);
	}
})
