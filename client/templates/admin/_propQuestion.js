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
			options: options
		}

		Meteor.call('createProp', q);
	}
});