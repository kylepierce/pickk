Template._situational.helpers({
	teams: function () {
		Meteor.subscribe('games');
		var live =  Games.find({live: true}).fetch();
		return live
	}
});


Template._situational.events({
	'click [data-action=situationalPicker]': function(event, template){
		event.preventDefault();
		var play = template.find('#play-picker :selected').text

		function fillerUp(que, o1, m1a, m1b, o2, m2a, m2b, o3, m3a, m3b, o4, m4a, m4b, o5, m5a, m5b, o6, m6a, m6b){
			$('#question').val(que);
			$('input[name="option1"]').val(o1);
			$('input[name="option2"]').val(o2);
			$('input[name="option3"]').val(o3);
			$('input[name="option4"]').val(o4);
			$('input[name="option5"]').val(o5);
			$('input[name="option6"]').val(o6);

			$('input[name="m1a"]').val(m1a);
			$('input[name="m2a"]').val(m2a);
			$('input[name="m3a"]').val(m3a);
			$('input[name="m4a"]').val(m4a);
			$('input[name="m5a"]').val(m5a);
			$('input[name="m6a"]').val(m6a);

			$('input[name="m1b"]').val(m1b);
			$('input[name="m2b"]').val(m2b);
			$('input[name="m3b"]').val(m3b);
			$('input[name="m4b"]').val(m4b);
			$('input[name="m5b"]').val(m5b);
			$('input[name="m6b"]').val(m6b);
		}

		switch (play){
			case "Sacks":
				fillerUp(
					"How Many Sacks Will the Patriots Have in the First Half?",
					"0 Sacks", 2, 3,
					"1 Sacks", 1, 2.5,
					"2 Sacks", 2.5, 4,
					"3 Sacks", 3, 5,
					"4 Sacks", 7, 10,
					"5 Sacks", 11, 15
					);
				break;
			case "Who Scores First?":
				fillerUp(
					"Who Scores First?",
					"Patriots Field Goal", 2, 4, 
					"Patriots Touchdown", 3, 5,
					"Patriots Safety", 23, 54,
					"Broncos Field Goal", 2, 4,
					"Broncos Touchdown", 3, 5,
					"Broncos Safety", 23, 54
					);
				break;
			case "This Drive":
				fillerUp(
					"How Will This Drive End?",
					"Punt", 1, 2,
					"Interception", 3, 5.5,
					"Fumble", 3, 5,
					"Touchdown", 2, 5,
					"Field Goal", 2, 4,
					"Other", 3, 6
					);
				break;
			case "Penalties":
				fillerUp(
					"How Many Penalties in the 1st Quarter?",
					"0 Penalties", 4, 7,
					"1 Penalties", 3, 4,
					"2 Penalties", 2, 3,
					"3-4 Penalties", 1, 2,
					"5-6 Penalties", 3, 4,
					"7+ Penalties", 8, 12
					);
				break;
			case "First Play":
				fillerUp(
					"What Will The First Play Be? (After Kickoff)",
					"Run", 2, 3,
					"Pass", 2, 3,
					"Fumble", 7, 10,
					"Interception", 7, 10,
					"Touchdown", 10, 12,
					"Safety", 20, 54 
					);
				break;
		}
	},

	'click [data-action=createSituational]': function (event, template) {
		event.preventDefault();
		var currentGame = Games.findOne({live: true});
		var currentGameId = currentGame._id 
		var question = $('#question').val()
		var options = '';
		var odds = [];
		var option1, option2, option3, option4, option5, option6, multi1, multi2, multi3, multi4, multi5, multi6

		// This code is terrible!!! I know but, I am trying to get it out as fast as possible and I dont have a much time to work on it. Feel free to buy 1 cases of beer if this code ever gets found by another developer.
		
		option1 = $('.option-boxes input')[0].value
		m1a = parseInt($('.option-boxes input')[1].value) 
		m1b = parseInt($('.option-boxes input')[2].value) 
		multi1 = randomizer(m1a, m1b)
		option2 = $('.option-boxes input')[3].value
		m2a = parseInt($('.option-boxes input')[4].value)
		m2b = parseInt($('.option-boxes input')[5].value) 
		multi2 =randomizer(m2a, m2b)
		option3 = $('.option-boxes input')[6].value
		m3a = parseInt($('.option-boxes input')[7].value)
		m3b = parseInt($('.option-boxes input')[8].value) 
		multi3 = randomizer(m3a, m3b)
		option4 = $('.option-boxes input')[9].value
		m4a = parseInt($('.option-boxes input')[10].value)
		m4b = parseInt($('.option-boxes input')[11].value) 
		multi4 = multi4 = randomizer(m4a, m4b)
		option5 = $('.option-boxes input')[12].value
		m5a = parseInt($('.option-boxes input')[13].value)
		m5b = parseInt($('.option-boxes input')[14].value) 
		multi5 = randomizer(m5a, m5b)
		option6 = $('.option-boxes input')[15].value
		m6a = parseInt($('.option-boxes input')[16].value)
		m6b = parseInt($('.option-boxes input')[17].value) 
		multi6 = randomizer(m6a, m6b)


		function randomizer(min, max){
			var calculations =  Math.random() * (max-min) + min
			var dec = calculations.toFixed(2)
			return dec
		}

		Meteor.call("questionPush", currentGameId, question)
		Meteor.call("emptyInactive", currentGameId, question)
		Meteor.call('insertQuestion', currentGameId, question, true, option1, multi1, option2, multi2, option3, multi3, option4, multi4, option5, multi5, option6, multi6);
		}
});