Template._propQuestion.helpers({
	game: function () {
		var gameId = Router.current().params._id
		var game = Games.findOne({_id: gameId})
		return game
	},
	teamOne: function () {
		return this.scoring.away.name
	},
	teamTwo: function () {
		return this.scoring.home.name
	}
});

Template._propQuestion.events({
	'click [data-action=teamOne]': function () {
		var team = this.scoring.away.name
		var old = $('#question-input').val()
		if (old !== "") {
			var question = $('#question-input').val(old + " " + team + " ")
		} else {
			var question = $('#question-input').val(team + " ")
		}		
		$("#question-input").focus()
	},
	'click [data-action=teamTwo]': function () {
		var team = this.scoring.home.name
		var old = $('#question-input').val()
		if (old !== "") {
			var question = $('#question-input').val(old + " " + team + " ")
		} else {
			var question = $('#question-input').val(team + " ")
		}		
		$("#question-input").focus()
	},
	'click [data-action=propCreation]': function () {
		event.preventDefault();
		var gameId = Router.current().params._id
		var game = Games.findOne({});
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
			commercial: true,
			options: options,
			active: "future"
		}

		Meteor.call('createProp', q);
		sAlert.success("Posted " + question + "!" , {effect: 'slide', position: 'bottom', html: true});
		IonModal.close();
	}
});