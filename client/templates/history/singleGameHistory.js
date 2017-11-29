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

Template.gameHistory.helpers({});

Template.gameHistory.events({
	'click': function(){
    IonModal.open('questionDetails', this);
	},
	'click [data-action=previous-answers]': function (e, t) {
		var gameId = Router.current().params._id
		analytics.track("List Item In Card", {
			location: "Waiting Screen",
			type: "History",
			gameId: gameId,
		});
		Router.go('/history/' + gameId);
	},
})
Template.listOfQuestions.helpers({
	questions: function (number) {
		return Questions.find({}, { sort: { dateCreated: -1 } }).fetch()
	}
});