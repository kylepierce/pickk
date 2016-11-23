Template._gameScoreModal.helpers({
	game: function () {
		var gameId = Router.current().params._id
		var game = Games.findOne({_id: gameId})
		return game.scoring
	},
	teamOne: function () {
		return this.away.name
	},
	teamOneScore: function () {
		return this.away.runs
	},
	teamTwo: function () {
		return this.home.name
	},
	teamTwoScore: function () {
		return this.home.runs
	},
	gameOpen: function () {
		var status = this.status === "inprogress" && this.live === true
    if (status){
      return true
    }
	},
	endOfGame: function () {
		var status = this.status === "completed"
    if (status){
      return true
    }
	}
});

Template._gameScoreModal.events({
	'click [data-action=submit]': function () {
		// ...
		var homeScore = $('#home')[0].value
		var awayScore = $('#away')[0].value
		homeScore = parseInt(homeScore)
		awayScore = parseInt(awayScore)
		var gameId = Router.current().params._id
		
		Meteor.call('updateGameScore', gameId, homeScore, awayScore)
		IonModal.close();
	},	
	'click [data-action="endQuarter"]': function () {
		var gameId = Router.current().params._id
		var game = Games.findOne({_id: gameId});
		var active = parseInt(game.period)
		var current = parseInt(Router.current().params.period)
		if (current === active){
			if(confirm("Are you sure?")) {
				Meteor.call('nextPeriod', gameId, current)
				Meteor.call('awardLeaders', gameId, current);
				Meteor.call('coinMachine', gameId, current);
				sAlert.success("On to the next one!!" , {effect: 'slide', position: 'bottom', html: true});
				var next = current + 1
				Router.go("/admin/game/" + gameId + "/" + next);
			}
		} else {
			alert('Not active.')
		}
		
	},
	'click [data-action="open"]': function (e, t) {
		var gameId = Router.current().params._id
		Meteor.call('openGame', gameId)
		IonModal.close();
		sAlert.success("Opened Game" , {effect: 'slide', position: 'bottom', html: true});
	},
	'click [data-action="end"]': function (e, t) {
		var gameId = Router.current().params._id
		if(confirm("Are you sure?")) {
			Meteor.call('endGame', gameId)
			IonModal.close();
			sAlert.success("Closed Game" , {effect: 'slide', position: 'bottom', html: true});
		}
	},
});