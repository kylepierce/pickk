Template._twoOption.helpers({
	teams: function () {
		Meteor.subscribe('games');
		var live =  Games.find({live: true}).fetch();
		return live
	}
});


Template._twoOption.events({
	'click [data-action=twoOptionPicker]': function(event, template){
		event.preventDefault();
		var play = template.find('#play-picker :selected').text

		function fillerUp(que, o1, m1, o2, m2){
			$('#question').val(que);
			$('input[name="option1"]').val(o1);
			$('input[name="option2"]').val(o2);

			$('input[name="m1a"]').val(m1);
			$('input[name="m2a"]').val(m2);
		}

		switch (play){
			case "Sacks":
				fillerUp(
					"How Many Sacks Will the Patriots Have in the First Half?",
					"0 Sacks", 2,
					"1 Sacks", 1
				);
				break;
		}
	},

	'click [data-action=twoOptionCreation]': function (event, template) {
		event.preventDefault();
		var currentGame = Games.findOne({live: true});
		var currentGameId = currentGame._id 
		var question = $('#question').val()
		var options = '';
		var odds = [];
		var option1, option2

		// This code is terrible!!! I know but, I am trying to get it out as fast as possible and I dont have a much time to work on it. Feel free to buy 1 cases of beer if this code ever gets found by another developer.
		
		option1 = $('.option-boxes input')[0].value
		multi1 = parseFloat($('.option-boxes input')[1].value) 
		option2 = $('.option-boxes input')[2].value
		multi2 = parseFloat($('.option-boxes input')[3].value)
	

		// function randomizer(min, max){
		// 	var calculations =  Math.random() * (max-min) + min
		// 	var dec = calculations.toFixed(2)
		// 	return dec
		// }

		console.log(multi1 + " " + multi2)

		Meteor.call("questionPush", currentGameId, question)
		Meteor.call("emptyInactive", currentGameId, question)
		Meteor.call('createTwoOption', currentGameId, question, option1, multi1, option2, multi2);
		}
});