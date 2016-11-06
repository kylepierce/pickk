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
		console.log(e, t)
		var isNotANumber = isNaN(e.currentTarget.value) 
		console.log(isNotANumber)
		if (isNotANumber === true){
			console.log("Alert")
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

		function randomizer(min, max){
			var min = parseFloat(min)
			var max = parseFloat(max)
			var multi = (Math.random() * (max-min) + min).toFixed(1)
			return multi
		}

		// How many option boxes have been filled?
		var optionBoxes = $('.option-boxes')
		for (i = 0; i < optionBoxes.length; i++) {
			var title = optionBoxes[i].children[0].value
			
			if (title === "" || title === undefined){
				title = "No Option"
			} else {
				var optionNum = "option" + (i + 1)
				var low = optionBoxes[i].children[1].value
				var high = optionBoxes[i].children[2].value
				var multi = randomizer(low, high)

				options[optionNum] = {
					option: optionNum,
					title: title,
					multiplier: multi
				}
			}
			
		}
		var q = {
			que: question,
			gameId: gameId,
			type: "prop",
			commercial: false,
			options: options,
			active: "future"
		}

		Meteor.call('createProp', q);
	}
});