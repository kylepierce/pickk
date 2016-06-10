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
			case "fStart":
				fillerUp("Who Will Score Next?",
					"LeBron James", 2,
					"J.R. Smith", 3.5
				);
				break;

			case "f11:30":
				fillerUp("Will Golden State Warriors Block A Shot Between 10:59 - 9:00?",
					"true", 3.5,
					"false", 2
				);
				break;

			case "f10:30":
				fillerUp("Will Kyrie Irving Score The Next Points?",
					"true", 2.5,
					"false", 2.5
				);
				break;

			case "f9:30":
				fillerUp("Will LeBron Make a Free Throw Between 8:59 - 7:00?",
					"true", 3.5,
					"false", 2
				);
				break;

			case "f8:30":
				fillerUp("Will Andre Iguodala Get The Next Rebound?",
					"true", 3.75,
					"false", 2
				);
				break;

			case "f7:30":
				fillerUp("Will Klay Thompson Make a Three Point Shot Between 6:59 - 5:00?",
					"true", 3.25,
					"false", 2
				);
				break;

			case "f6:30":
				fillerUp("Will LeBron Get The Next Rebound?",
					"true", 3.25,
					"false", 2
				);
				break;

			case "f5:30":
				fillerUp("Will Stephen Curry Have a Steal Between 4:59 - 3:00?",
					"true", 4.35,
					"false", 2
				);
				break;

			case "f4:30":
				fillerUp("Will Channing Frye Score the Next Three?",
					"true", 3.25,
					"false", 2
				);
				break;

			case "f3:30":
				fillerUp("Will Timofey Mozgov Block a Shot Between 2:59 - 1:00? ",
					"true", 4.5,
					"false", 2
				);
				break;
			case "f2:30":
				fillerUp("Will Harrison Barnes Make a Three Point Shot 1:59 - 1:00? ",
					"true", 3.5,
					"false", 2
				);
				break;
			case "f1:30":
				fillerUp("Will Matthew Dellavedova Score Between :59 - :00? ",
					"true", 2,
					"false", 2
				);
				break;

 //////////////////////////////////////////////

			case "sStart":
				fillerUp("Who Will Score Next?",
					"Stephen Curry", 2,
					"Draymond Green", 3.5
				);
				break;

			case "s11:30":
				fillerUp("Will Golden State Warriors Block A Shot Between 10:59 - 9:00?",
					"true", 3.5,
					"false", 2
				);
				break;

			case "s10:30":
				fillerUp("Will Kyrie Irving Score The Next Points For the Cavaliers?",
					"true", 2.5,
					"false", 2.5
				);
				break;

			case "s9:30":
				fillerUp("Will J.R. Smith Make a Free Throw Between 8:59 - 7:00?",
					"true", 3.5,
					"false", 2
				);
				break;

			case "s8:30":
				fillerUp("Will Andre Iguodala Get The Next Rebound?",
					"true", 3.75,
					"false", 2
				);
				break;

			case "s7:30":
				fillerUp("Will Draymond Green Have a Rebound Between 6:59 - 5:00?",
					"true", 3.25,
					"false", 2
				);
				break;

			case "s6:30":
				fillerUp("Who Will Score Next?",
					"Tristan Thompson", 3.25,
					"Kyrie Irving", 2
				);
				break;

			case "s5:30":
				fillerUp("Will Stephen Curry Score a Three Between 4:59 - 3:00?",
					"true", 4.35,
					"false", 2
				);
				break;

			case "s4:30":
				fillerUp("Will Iman Shumpert Score the Next Three for the Cavaliers?",
					"true", 3.25,
					"false", 2
				);
				break;

			case "s3:30":
				fillerUp("Will Andrew Bogut Block a Shot Between 2:59 - 1:00? ",
					"true", 7.5,
					"false", 2
				);
				break;
			case "s2:30":
				fillerUp("Will Shaun Livingston Make a Three Point Shot 1:59 - 1:00? ",
					"true", 3.5,
					"false", 2
				);
				break;
			case "s1:30":
				fillerUp("Will Richard Jefferson Score Between :59 - :00? ",
					"true", 2,
					"false", 2
				);
				break;

/////////////////////////////////////////////

			case "tStart":
				fillerUp("Who Will Score Next?",
					"LeBron James", 2,
					"J.R. Smith", 3.5
				);
				break;

			case "t11:30":
				fillerUp("Will Golden State Warriors Block A Shot Between 10:59 - 9:00?",
					"true", 3.5,
					"false", 2
				);
				break;

			case "t10:30":
				fillerUp("Will Kyrie Irving Score The Next Points?",
					"true", 2.5,
					"false", 2.5
				);
				break;

			case "t9:30":
				fillerUp("Will LeBron Make a Free Throw Between 8:59 - 7:00?",
					"true", 3.5,
					"false", 2
				);
				break;

			case "t8:30":
				fillerUp("Will Andre Iguodala Get The Next Rebound?",
					"true", 3.75,
					"false", 2
				);
				break;

			case "t7:30":
				fillerUp("Will Klay Thompson Make a Three Point Shot Between 6:59 - 5:00?",
					"true", 3.25,
					"false", 2
				);
				break;

			case "t6:30":
				fillerUp("Will LeBron Get The Next Rebound?",
					"true", 3.25,
					"false", 2
				);
				break;

			case "t5:30":
				fillerUp("Will Stephen Curry Have a Steal Between 4:59 - 3:00?",
					"true", 4.35,
					"false", 2
				);
				break;

			case "t4:30":
				fillerUp("Will Channing Frye Score the Next Three?",
					"true", 3.25,
					"false", 2
				);
				break;

			case "t3:30":
				fillerUp("Will Timofey Mozgov Block a Shot Between 2:59 - 1:00? ",
					"true", 4.5,
					"false", 2
				);
				break;
			case "t2:30":
				fillerUp("Will Harrison Barnes Make a Three Point Shot 1:59 - 1:00? ",
					"true", 3.5,
					"false", 2
				);
				break;
			case "t1:30":
				fillerUp("Will Matthew Dellavedova Score Between :59 - :00? ",
					"true", 2,
					"false", 2
				);
				break;

 //////////////////////////////////////////////

			case "fourStart":
				fillerUp("Who Will Score Next?",
					"Stephen Curry", 2,
					"Draymond Green", 3.5
				);
				break;

			case "four11:30":
				fillerUp("Will Golden State Warriors Block A Shot Between 10:59 - 9:00?",
					"true", 3.5,
					"false", 2
				);
				break;

			case "four10:30":
				fillerUp("Will Kyrie Irving Score The Next Points For the Cavaliers?",
					"true", 2.5,
					"false", 2.5
				);
				break;

			case "four9:30":
				fillerUp("Will J.R. Smith Make a Free Throw Between 8:59 - 7:00?",
					"true", 3.5,
					"false", 2
				);
				break;

			case "four8:30":
				fillerUp("Will Andre Iguodala Get The Next Rebound?",
					"true", 3.75,
					"false", 2
				);
				break;

			case "four7:30":
				fillerUp("Will Draymond Green Have a Rebound Between 6:59 - 5:00?",
					"true", 3.25,
					"false", 2
				);
				break;

			case "four6:30":
				fillerUp("Who Will Score Next?",
					"Tristan Thompson", 3.25,
					"Kyrie Irving", 2
				);
				break;

			case "four5:30":
				fillerUp("Will Stephen Curry Score a Three Between 4:59 - 3:00?",
					"true", 4.35,
					"false", 2
				);
				break;

			case "four4:30":
				fillerUp("Will Iman Shumpert Score the Next Three for the Cavaliers?",
					"true", 3.25,
					"false", 2
				);
				break;

			case "four3:30":
				fillerUp("Will Andrew Bogut Block a Shot Between 2:59 - 1:00? ",
					"true", 7.5,
					"false", 2
				);
				break;
			case "four2:30":
				fillerUp("Will Shaun Livingston Make a Three Point Shot 1:59 - 1:00? ",
					"true", 3.5,
					"false", 2
				);
				break;
			case "four1:30":
				fillerUp("Will Richard Jefferson Score Between :59 - :00? ",
					"true", 2,
					"false", 2
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