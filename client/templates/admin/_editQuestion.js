Template._editQuestion.helpers({
	choices: function (q) {
		var data = q.options
	  var keys = _.keys(data)
	  var values = _.values(data)
	  var optionsArray = []

	  // [{number: option1}, {title: Run}, {multiplier: 2.43}]

	  for (var i = 0; i < keys.length; i++) {
	    var obj = values[i]
	    var number = keys[i]
	    obj["option" + i] = number 
	    optionsArray.push(obj)
	  }

	  return optionsArray
	}
});

Template._editQuestion.events({
	'change .option-range': function(e, t){
		var isNotANumber = isNaN(e.currentTarget.value) 
		if (isNotANumber === true){
			alert("That is not a number");
		}
	},
	'click [data-action=editQuestion]': function (e, t) {
		event.preventDefault();
		var question = $('#question-input').val()
		var options = {}

		if (!question){
			inputError("Missing A Question! C'Mon Man")
			return false
		}

		function inputError(reason){
			sAlert.error("Error: " + reason , {effect: 'slide', position: 'bottom', html: true});
		}

		// How many option boxes have been filled?
		var optionBoxes = $('.option-boxes')

		for (i = 0; i < optionBoxes.length; i++) {
			var title = optionBoxes[i].children[0].value
			var optionNum = "option" + (i + 1)
			var multi = optionBoxes[i].children[1].value
			var isNotANumber = isNaN(multi)

			if (!title) {
				inputError("Missing title")
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

		var q = {
			questionId: this._id,
			que: question,
			options: options,
		}

		Meteor.call('editQuestion', q);
		sAlert.success("Added " + question + " to future!" , {effect: 'slide', position: 'bottom', html: true});
		IonModal.close();
	}
});