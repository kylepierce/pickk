Template._propQuestion.helpers({
	game: function () {
		var gameId = Router.current().params._id
		var game = Games.findOne({_id: gameId})
		return game
	},
	teamOne: function () {
		return this.away.name
	},
	teamTwo: function () {
		return this.home.name
	}
});

Template._propQuestion.events({
	'change .option-range': function(e, t){
		var isNotANumber = isNaN(e.currentTarget.value) 
		console.log(isNotANumber)
		if (isNotANumber === true){
			alert("That is not a number");
		} else if (isNotANumber === false){
			var box = e.currentTarget.classList
			console.log(box)
			box[1] = 'acceptable'
		}
	},
	'click [data-action=teamOne]': function () {
		var team = this.away.name
		var old = $('#question-input').val()
		if (old !== "") {
			var question = $('#question-input').val(old + " " + team + " ")
		} else {
			var question = $('#question-input').val(team + " ")
		}		
		$("#question-input").focus()
	},
	'click [data-action=teamTwo]': function () {
		var team = this.home.name
		var old = $('#question-input').val()
		if (old !== "") {
			var question = $('#question-input').val(old + " " + team + " ")
		} else {
			var question = $('#question-input').val(team + " ")
		}		
		$("#question-input").focus()
	},
	'click [data-action=playSelection]': function () {
		event.preventDefault();
		var gameId = Router.current().params._id
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
			console.log(reason)
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
				var low = optionBoxes[i].children[1].value
				var high = optionBoxes[i].children[2].value
				var multi = randomizer(low, high)
				var isNotANumber = isNaN(multi)
				console.log(low, high, multi, isNotANumber)
				if (!low) {
					inputError("Missing Multipliers!")
					return false
				}
				if (low > high){
					inputError("Min value cannot be larger than the max!")
					return false
				} 
				if (isNotANumber) {
					inputError("Not a Number / Missing Multiplier!")
					return false
				}

				options[optionNum] = {
					number: i + 1,
					option: optionNum,
					title: title,
					multiplier: multi
				}
			}
		}
		console.log(options)
		var q = {
			que: question,
			gameId: gameId,
			type: "prop",
			commercial: false,
			options: options,
			active: "future"
		}

		Meteor.call('createProp', q);
		sAlert.success("Posted " + question + "!" , {effect: 'slide', position: 'bottom', html: true});
	}
});