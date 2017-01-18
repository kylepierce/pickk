Template._propQuestion.helpers({
	start: function(){
		return [
			" ",
			"Will the",
			"Who Will",
			"Will",
			"How Many Points Will the",
			"Which"
		]
	},
	who: function () {
		var game = Games.find({}).fetch()[0];
		var home = Teams.find({_id: game.scoring.home.id}).fetch()[0];
		var away = Teams.find({_id: game.scoring.away.id}).fetch()[0];
		var list = [
			" ",
		]
		list.push(home.fullName)
		list.push.apply(list, home.players)
		list.push("------ ------- ------- -------")
		list.push(away.fullName)
		list.push.apply(list, away.players)

		return list
	},
	what: function () {
		return [
			" ",
			"Block a Shot",
			"Score a Three",
			"Get A Steal",
			"Make a Free Throw",
			"Get The Next Rebound",
			"Dunk",
			"Have",
			"Score",
			"Player Commits the First Foul",
			"Who Scores The Next 3 Point Shot?",
			"Score Last",
		]
	},
	when: function(){
		return [
			" ",
			"in the 1st Quarter?",
			"in the 2nd Quarter?",
			"in the 3rd Quarter?",
			"in the 4th Quarter?",
			"Will Between 10:59 - 9:00?",
			"Will Between 9:59 - 8:00?",
			"Will Between 8:59 - 7:00?",
			"Will Between 7:59 - 6:00?",
			"Will Between 6:59 - 5:00?",
			"Will Between 5:59 - 4:00?",
			"Will Between 4:59 - 3:00?",
			"Will Between 3:59 - 2:00?",
			"Will Between 2:59 - 1:00?",
			"Will Between 1:59 - :00?",
			"First?",
			"Next?"
		]
	},
	game: function () {
		var gameId = Router.current().params._id
		var game = Games.findOne({_id: gameId})
		return game
	},
	teamOnePlayers: function (){
		var gameId = Router.current().params._id
		var game = Games.findOne({_id: gameId})
		var teamId = game.scoring.home.id
		var team = Teams.findOne({_id: teamId});
		return team.players
	},
	teamTwoPlayers: function (){
		var gameId = Router.current().params._id
		var game = Games.findOne({_id: gameId})
		var teamId = game.scoring.away.id
		var team = Teams.findOne({_id: teamId});
		return team.players
	},
	teamOne: function () {
		return this.scoring.away.name
	},
	teamTwo: function () {
		return this.scoring.home.name
	}
});

Template._propQuestion.events({
	'click [data-action="propText"]': function (e,t){
		var start = $('#start').val()
		var who = $('#who').val()
		var what = $('#what').val()
		var when = $('#when').val()
		var old = $('#question-input').val()
		var question = $('#question-input').val(start + " " + who + " " + what + " " + when)
		$("#question-input").focus()
	},
	'click [data-action=trueFalse]': function(){
		var optionBoxes = $('.option-boxes')
		optionBoxes[0].children[0].value = "True"
		optionBoxes[1].children[0].value = "False"
	},
	'click [data-action=startingFiveHome]': function(){
		var optionBoxes = $('.option-boxes')
		var game = Games.find({}).fetch()[0];
		var home = Teams.find({_id: game.scoring.home.id}).fetch()[0];
		var players = home.players
		var i = 0
		_.each(players, function(player){
			optionBoxes[i].children[0].value = player
			i ++
		});
	},
	'click [data-action=startingFiveAway]': function(){
		var optionBoxes = $('.option-boxes')
		var game = Games.find({}).fetch()[0];
		var away = Teams.find({_id: game.scoring.away.id}).fetch()[0];
		var players = away.players
		var i = 0
		_.each(players, function(player){
			optionBoxes[i].children[0].value = player
			i ++
		});
	},
	'click [data-action=propCreation]': function () {
		event.preventDefault();
		var gameId = Router.current().params._id
		var game = Games.findOne({});
		var sport = game.sport;
		var period = parseInt(Router.current().params.period)
		var question = $('#question-input').val()
		var options = {}

		if (!question){
			inputError("Missing A Question! C'Mon Man")
			return false
		}

		function randomizer(min, max){
			var min = parseFloat(min)
			if (!max){
				var max = parseFloat(min)
			} else {
				var max = parseFloat(max)
			}
			var multi = (Math.random() * (max-min) + min).toFixed(1)
			return multi
		}

		function inputError(reason){
			sAlert.error("Error: " + reason , {effect: 'slide', position: 'bottom', html: true});
		}

		// How many option boxes have been filled?
		var optionBoxes = $('.option-boxes')
		if (optionBoxes[0].children[0].value === ""){
			inputError("No options");
			return false
		} else if ( optionBoxes[1].children[0].value === "") {
			inputError("Not Enough Options. At least 2 Options Are Needed!");
			return false
		}

		for (i = 0; i < optionBoxes.length; i++) {
			var title = optionBoxes[i].children[0].value

			if (title === "" || title === undefined){
				title = "No Option"
			} else {
				var optionNum = "option" + (i + 1)
				var dropDown = optionBoxes[i].children[1].value
				switch(dropDown){
					case "Low (1.5-2.5)":
						var multi = randomizer(1.5, 2.5)
						break
					case "Mid (2.5-4)":
						var multi = randomizer(2.5, 4)
						break
					case "High (4-7)":
						var multi = randomizer(4, 7)
						break
					case "Extra High 😎 (10-19)":
						var multi = randomizer(10, 19)
						break
					case "Game Changer (20+)":
						var multi = randomizer(20, 35)
						break
				}

				options[optionNum] = {
					number: i + 1,
					option: optionNum,
					title: title,
					multiplier: multi
				}
			}
		}
		var q = {
			que: question,
			gameId: gameId,
			period: period,
			type: "prop",
			sport: sport,
			commercial: true,
			options: options,
			active: "future"
		}

		Meteor.call('createProp', q);
		sAlert.success("Posted " + question + "!" , {effect: 'slide', position: 'bottom', html: true});
		IonModal.close();
	}
});
