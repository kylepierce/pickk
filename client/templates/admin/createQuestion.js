Template.createQuestion.events({
	'click [data-action="thisDrive"]': function(e, t){
		event.preventDefault();
		var gameId = Router.current().params._id

		// Capture the current situation in the game
		var inputsObj = {}
		var inputs = ["down", "yards", "area", "time"]

		inputs.map(function (input){
			var text = "input[name=" + input + "]"
			var inputValue = t.find(text).value
			inputsObj[input] = inputValue
		});

		// One object to be passed to the insertQuestion method.
		var q = {
			gameId: gameId,
			type: "drive",
			inputs: inputsObj,
			commercial: true
		}

		Meteor.call('insertQuestion', q, function(e, r){
			if(!e){
				Meteor.call("questionPush", q.gameId, r)
				Meteor.call("emptyInactive", q.gameId)
			}
		});
 
	},

	'click [data-action=createQuestion]': function(e, t){
		// Turn off reload
		event.preventDefault();
		var gameId = Router.current().params._id

		// Capture the current situation in the game
		var inputsObj = {}
		var inputs = ["down", "yards", "area", "time"]

		inputs.map(function (input){
			var text = "input[name=" + input + "]"
			var inputValue = t.find(text).value
			inputsObj[input] = inputValue
		});

		// One object to be passed to the insertQuestion method.
		var q = {
			gameId: gameId,
			commercial: false,
			type: "play",
			inputs: inputsObj
		}

		// These need to be moved to a call back
		
		Meteor.call('insertQuestion', q, function(e, r){
			if(!e){
				Meteor.call("questionPush", q.gameId, r)
				Meteor.call("emptyInactive", q.gameId)
			}
		});
	},
'click [data-action=loop]': function () {
		var down = 6
		var downCounter = 1
		var yards = 6
		var yardsCounter = 1
		var area = 6
		var areaCounter = 1
		var counter = 0
		
		function randomizer(min, max){
			return (Math.random() * (max-min) + min).toFixed(2)
		}

		function multiplier(m1a, m1b, m2a, m2b, m3a, m3b, m4a, m4b, m5a, m5b, m6a, m6b){
			var options = {
				option1: {low: m1a, high: m1b},
				option2: {low: m2a, high: m2b},
				option3: {low: m3a, high: m3b},
				option4: {low: m4a, high: m4b},
				option5: {low: m5a, high: m5b},
				option6: {low: m6a, high: m6b},
			}
			return options
		}

		var multipliers = function (down, yards, area) {
			// First Down With Run Option
			if (down === 1) {
				// Inches
				if(yards == 1){
					if(area == 1){
						// Danger zone
						return multiplier(
							1.5, 1.7, 
							1.6, 2.42, 
							3.2, 4.81, 
							(3.2 * 2), (4.81 * 2), 
							2.2, 4.81, 
							15.9, 21.61)
					} else if (area == 2){
						// Most of the field 11 - 80 yard
						return multiplier(
							1.7, 1.9, 
							1.6, 2.02, 
							2.2, 4.81, 
							(2.2 * 2), (4.81 * 2), 
							2.2, 4.81, 
							11.9, 18.61)
					} else if (area == 3 || area == 4){
						// Red Zone
						return multiplier(
							1.5, 1.7, 
							1.6, 1.92, 
							2.2, 4.81, 
							(4.2 * 2), (8.81 * 2), 
							2.2, 4.81, 
							4.9, 7.61)
					} else if (area == 5){
						// Red Zone
						return multiplier(
							1.5, 1.7, 
							1.6, 1.92, 
							2.2, 4.81, 
							(4.2 * 2), (8.81 * 2), 
							2.2, 4.81, 
							2.9, 3.61)
					} else if (area == 6)	{
						// Goal Line
						return multiplier(
							1.7, 1.9, 
							1.6, 2.42, 
							2.2, 3.81, 
							(8.2 * 2), (10.81 * 2), 
							2.2, 4.81, 
							1.9, 2.61)
					}
				} 

				// 1-2 Yards
				else if (yards == 2){
					if(area == 1){
						// Danger zone
						return multiplier(
							1.5, 1.7, 
							1.6, 2.42, 
							3.2, 4.81, 
							(3.2 * 2), (4.81 * 2), 
							2.2, 4.81, 
							12.9, 23.61)
					} else if (area == 2){
						// Most of the field 11 - 80 yard
						return multiplier(
							1.7, 1.9, 
							1.6, 2.02, 
							2.2, 4.81, 
							(8.2 * 2), (10.81 * 2), 
							2.2, 4.81, 
							16.9, 18.61)
					} else if (area == 3 || area == 4){
						// Red Zone
						return multiplier(
							1.5, 1.7, 
							1.6, 1.92, 
							2.2, 4.81, 
							(10.2 * 2), (14.81 * 2), 
							2.2, 4.81, 
							8.9, 12.61)
					} else if (area == 5){
						// Red Zone
						return multiplier(
							1.5, 1.7, 
							1.6, 1.92, 
							2.2, 4.81, 
							(12.2 * 2), (16.81 * 2), 
							2.2, 4.81, 
							2.9, 3.61)
					} else if (area == 6)	{
						// Goal Line
						return multiplier(
							1.7, 1.9, 
							1.6, 2.42, 
							2.2, 3.81, 
							(12.2 * 2), (23.81 * 2), 
							2.2, 4.81, 
							1.9, 2.61)
					}
				} 

				// 3-5 Yards
				else if (yards == 3){
					if(area == 1){
						// Danger zone
						return multiplier(
							1.5, 1.7, 
							1.6, 2.42, 
							3.2, 4.81, 
							(3.2 * 2), (4.81 * 2), 
							2.2, 4.81, 
							13.9, 15.61)
					} else if (area == 2){
						// Most of the field 11 - 80 yard
						return multiplier(
							1.7, 1.9, 
							1.6, 2.02, 
							2.2, 4.81, 
							(5.2 * 2), (8.81 * 2), 
							2.2, 4.81, 
							10.9, 13.61)
					} else if (area == 3 || area == 4){
						// Red Zone
						return multiplier(
							1.5, 1.7, 
							1.6, 1.92, 
							2.2, 4.81, 
							(6.2 * 2), (8.81 * 2), 
							2.2, 4.81, 
							4.9, 7.61)
					} else if (area == 5){
						// Red Zone
						return multiplier(
							1.5, 1.7, 
							1.6, 1.92, 
							2.2, 4.81, 
							(12.2 * 2), (14.81 * 2), 
							2.2, 4.81, 
							2.9, 3.61)
					} else if (area == 6)	{
						// Goal Line
						return multiplier(
							1.7, 1.9, 
							1.6, 2.42, 
							2.2, 3.81, 
							(22.2 * 2), (23.81 * 2), 
							2.2, 4.81, 
							1.9, 2.61)
					}
				} 

				// 6-9 Yards
				else if (yards == 4){
					if(area == 1){
						// Danger zone
						return multiplier(
						 1.5, 1.7,
						 1.6, 2.42,
						 3.2, 4.81, 
						 (2.9 * 2), (3.61 * 2), 
						 2.9, 3.61, 
						 14.9, 18.61)
					} else if (area == 2){
						// Most of the field 11 - 80 yard
						return multiplier(
							1.7, 1.9, 
							1.6, 2.02, 
							2.2, 4.81, 
							(4.2 * 2), (4.81 * 2), 
							2.2, 4.81, 
							12.9, 15.61)
					} else if (area == 3 || area == 4){
						// Red Zone
						return multiplier(
							1.5, 1.7, 
							1.6, 1.92, 
							2.2, 4.81, 
							(6.2 * 2), (8.81 * 2), 
							2.2, 4.81, 
							4.9, 7.61)
					} else if (area == 5){
						// Red Zone
						return multiplier(
							1.5, 1.7,
						 1.6, 1.92,
						 2.2, 4.81, 
						 (12.9 * 2), (14.61 * 2), 
						 2.9, 4.61, 
						 2.9, 3.61)
					} else if (area == 6)	{
						// Goal Line
						return multiplier(
							1.7, 1.9,
						 1.6, 2.42,
						 2.2, 3.81, 
						 (13.9 * 2), (15.61 * 2),
						 3.9, 5.61, 
						 1.9, 2.61)
					}
				} 

				// 10-15 Yards
				else if (yards == 5){
					if(area == 1){
						// Danger zone
						return multiplier(
							1.5, 1.7, 
							1.6, 2.42, 
							3.2, 4.81, 
							(2.9 * 2), (3.61 * 2),
							2.9, 3.61, 
							12.9, 13.61)
					} else if (area == 2){
						// Most of the field 11 - 80 yard
						return multiplier(
							1.7, 1.9, 
							1.6, 2.02, 
							2.2, 4.81, 
							(2.2 * 2), (5.81 * 2), 
							2.2, 4.81, 
							8.9, 12.61)
					} else if (area == 3 || area == 4){
						// Red Zone
						return multiplier(
							1.5, 1.7, 
							1.6, 1.92, 
							2.2, 4.81, 
							(5.2 * 2), (8.81 * 2), 
							2.2, 4.81, 
							4.9, 7.61)
					} else if (area == 5){
						// Red Zone
						return multiplier(
							1.5, 1.7, 
							1.6, 1.92, 
							2.2, 4.81, 
							(8.9 * 2), (11.61 * 2),
							2.9, 4.61, 
							2.9, 3.61)
					} else if (area == 6)	{
						// Goal Line
						return multiplier(
							1.7, 1.9, 
							1.6, 2.42, 
							2.2, 3.81, 
							(13.9 * 2), (15.61 * 2), 
							3.9, 5.61, 
							1.9, 2.61)
					}
				} 

				// 15+ Yards
				else if (yards == 6){
					if(area == 1){
						// Danger zone
						return multiplier(
							1.5, 1.7, 
							1.6, 2.42, 
							3.2, 4.81, 
							(2.9 * 2), (3.61 * 2), 
							2.9, 3.61, 
							12.9, 23.61)
					} else if (area == 2){
						// Most of the field 11 - 80 yard
						return multiplier(
							1.7, 1.9, 
							1.6, 2.02, 
							2.2, 4.81, 
							(2.2 * 2), (4.81 * 2), 
							2.2, 4.81, 
							9.9, 13.61)
					} else if (area == 3 || area == 4){
						// Red Zone
						return multiplier(
							1.5, 1.7, 
							1.6, 1.92, 
							2.2, 4.81, 
							(5.2 * 2), (6.81 * 2), 
							2.2, 4.81, 
							4.9, 9.61)
					} else if (area == 5){
						// Red Zone
						return multiplier(
							1.5, 1.7, 
							1.6, 1.92, 
							2.2, 4.81, 
							(8.9 * 2), (13.61 * 2), 
							2.9, 4.61, 
							2.9, 4.61)
					} else if (area == 6)	{
						// Goal Line
						return multiplier(
							1.7, 1.9, 
							1.6, 2.42, 
							2.2, 3.81, 
							(13.9 * 2), (15.61 * 2), 
							3.9, 5.61, 
							1.9, 2.61)
					}
				}
			}

			// Second Down
			else if(down == 2){

				// Inches
				if(yards == 1){
					if(area == 1){
						// Danger zone
						return multiplier(
							1.5, 1.7, 
							1.6, 2.42, 
							2.9, 3.61, 
							2.9, 3.61, 
							2.2, 4.81, 
							12.9, 15.61)
					} else if (area == 2){
						// Most of the field 11 - 80 yard
						return multiplier(
							1.7, 1.9, 
							1.6, 2.02, 
							2.2, 4.81,
							2.2, 4.81, 
							2.2, 4.81, 
							6.9, 12.61)
					} else if (area == 3 || area == 4){
						// Red Zone
						return multiplier(
							1.5, 1.7, 
							1.6, 1.92, 
							2.2, 4.81,
							2.2, 4.81, 
							2.2, 4.81, 
							4.9, 7.61)
					} else if (area == 5){
						// Red Zone
						return multiplier(
							1.5, 1.7, 
							1.6, 1.92, 
							2.9, 4.61, 
							2.9, 4.61, 
							2.2, 4.81, 
							2.9, 3.61)
					} else if (area == 6)	{
						// Goal Line
						return multiplier(
							1.7, 1.9, 
							1.6, 2.42, 
							3.9, 5.61, 
							3.9, 5.61, 
							2.2, 4.81, 
							1.9, 2.61)
					}
				} 

				// 1-2 Yards
				else if (yards == 2){
					if(area == 1){
						// Danger zone
						return multiplier(
							1.5, 1.7, 
							1.6, 2.42, 
							2.9, 3.61, 
							2.9, 3.61, 
							2.2, 4.81, 
							2.9, 3.61)
					} else if (area == 2){
						// Most of the field 11 - 80 yard
						return multiplier(
							1.7, 1.9, 
							1.6, 2.02, 
							2.2, 4.81,
							2.2, 4.81, 
							2.2, 4.81, 
							6.9, 8.61)
					} else if (area == 3 || area == 4){
						// Red Zone
						return multiplier(
							1.5, 1.7, 
							1.6, 1.92, 
							2.2, 4.81, 
							2.2, 4.81, 
							2.2, 4.81, 
							4.9, 7.61)
					} else if (area == 5){
						// Red Zone
						return multiplier(
							1.5, 1.7, 
							1.6, 1.92, 
							2.9, 4.61, 
							2.9, 4.61, 
							2.2, 4.81, 
							2.9, 3.61)
					} else if (area == 6)	{
						// Goal Line
						return multiplier(
							1.7, 1.9, 
							1.6, 2.42, 
							3.9, 5.61,
							3.9, 5.61, 
							2.2, 4.81, 
							1.9, 2.61)
					}
				} 

				// 3-5 Yards
				else if (yards == 3){
					if(area == 1){
						// Danger zone
						return multiplier(
							1.5, 1.7, 
							1.6, 2.42, 
							2.9, 3.61,
							2.9, 3.61, 
							2.2, 4.81, 
							12.9, 15.61)
					} else if (area == 2){
						// Most of the field 11 - 80 yard
						return multiplier(
							1.7, 1.9, 
							1.6, 2.02, 
							2.2, 4.81, 
							2.2, 4.81, 
							2.2, 4.81, 
							8.9, 12.61)
					} else if (area == 3 || area == 4){
						// Red Zone
						return multiplier(
							1.5, 1.7, 
							1.6, 1.92, 
							2.2, 4.81,
							2.2, 4.81, 
							2.2, 4.81, 
							6.9, 9.61)
					} else if (area == 5){
						// Red Zone
						return multiplier(
							1.5, 1.7, 
							1.6, 1.92, 
							2.9, 4.61,
							2.9, 4.61, 
							2.2, 4.81, 
							3.9, 4.61)
					} else if (area == 6)	{
						// Goal Line
						return multiplier(
							1.7, 1.9, 
							1.6, 2.42, 
							3.9, 5.61,
							3.9, 5.61, 
							2.2, 4.81, 
							1.9, 2.61)
					}
				} 
				
				// 6-9 Yards
				else if (yards == 4){
					if(area == 1){
						// Danger zone
						return multiplier(
							1.5, 1.7, 
							1.6, 2.42, 
						  2.9, 3.61,
							2.9, 3.61, 
							2.2, 4.81, 
							12.9, 15.61)
					} else if (area == 2){
						// Most of the field 11 - 80 yard
						return multiplier(
							1.7, 1.9, 
							1.6, 2.02, 
							2.2, 4.81,
							2.2, 4.81, 
							2.2, 4.81, 
							8.9, 12.61)
					} else if (area == 3 || area == 4){
						// Red Zone
						return multiplier(
							1.5, 1.7, 
							1.6, 1.92, 
							2.2, 4.81,
							2.2, 4.81, 
							2.2, 4.81, 
							4.9, 7.61)
					} else if (area == 5){
						// Red Zone
						return multiplier(
							1.5, 1.7, 
							1.6, 1.92, 
							2.9, 4.61, 
							2.9, 4.61, 
							2.2, 4.81, 
							2.9, 3.61)
					} else if (area == 6)	{
						// Goal Line
						return multiplier(
							1.7, 1.9, 
							1.6, 2.42, 
							3.9, 5.61,
							3.9, 5.61, 
							2.2, 4.81, 
							1.9, 2.61)
					}
				} 

				// 10-15 Yards
				else if (yards == 5){
					if(area == 1){
						// Danger zone
						return multiplier(
							1.5, 1.7, 
							1.6, 2.42, 
							2.9, 3.61,
							2.9, 3.61, 
							2.2, 4.81, 
							12.9, 15.61)
					} else if (area == 2){
						// Most of the field 11 - 80 yard
						return multiplier(
							1.7, 1.9, 
							1.6, 2.02, 
							2.2, 4.81,
							2.2, 4.81, 
							2.2, 4.81, 
							6.9, 12.61)
					} else if (area == 3 || area == 4){
						// Red Zone
						return multiplier(
							1.5, 1.7, 
							1.6, 1.92, 
							2.2, 4.81,
							2.2, 4.81, 
							2.2, 4.81, 
							4.9, 7.61)
					} else if (area == 5){
						// Red Zone
						return multiplier(
							1.5, 1.7, 
							1.6, 1.92, 
							2.9, 4.61,
							2.9, 4.61, 
							2.2, 4.81, 
							2.9, 3.61)
					} else if (area == 6)	{
						// Goal Line
						return multiplier(
							1.7, 1.9, 
							1.6, 2.42, 
							3.9, 5.61,
							3.9, 5.61, 
							2.2, 4.81, 
							1.9, 2.61)
					}
				} 

				// 15+ Yards
				else if (yards == 6){
					if(area == 1){
						// Danger zone
						return multiplier(
							1.5, 1.7, 
							1.6, 2.42, 
							2.9, 3.61, 
							2.9, 3.61, 
							2.2, 4.81, 
							12.9, 15.61)
					} else if (area == 2){
						// Most of the field 11 - 80 yard
						return multiplier(
							1.7, 1.9, 
							1.6, 2.02, 
							2.2, 4.81,
							2.2, 4.81, 
							2.2, 4.81, 
							8.9, 12.61)
					} else if (area == 3 || area == 4){
						// Red Zone
						return multiplier(
							1.5, 1.7, 
							1.6, 1.92, 
							2.2, 4.81, 
							2.2, 4.81, 
							2.2, 4.81, 
							4.9, 7.61)
					} else if (area == 5){
						// Red Zone
						return multiplier(
							1.5, 1.7, 
							1.6, 1.92, 
							2.9, 4.61, 
							2.9, 4.61, 
							2.2, 4.81, 
							2.9, 3.61)
					} else if (area == 6)	{
						// Goal Line
						return multiplier(
							1.7, 1.9, 
							1.6, 2.42, 
							3.9, 5.61,
							3.9, 5.61, 
							2.2, 4.81, 
							1.9, 2.61)
					}
				}
			} 

			else if(down == 3 && area == 6){
				return multiplier(
					1.7, 2.6, 
					3.9, 4.82, 
					(5.9 * 2), (8.61 * 2), 
					5.9, 8.61, 
					2.2, 4.81, 
					2.9, 4.61)
			}

			// Third Down
			else if(down == 3){

				// Inches
				if(yards == 1){
					if(area == 1){
						// Danger zone
						return multiplier(
							1.7, 2.6, 
							3.9, 4.82, 
							(5.9 * 2), (8.61 * 2), 
							5.9, 8.61, 
							2.2, 4.81, 
							15.9, 23.61)
					} else if (area == 2){
						// Most of the field 11 - 80 yard
						return multiplier(
							1.7, 2.6, 
							2.9, 3.82, 
							(4.2 * 2), (7.81 * 2), 
							4.2, 7.81, 
							2.2, 4.81, 
							10.9, 12.61)
					} else if (area == 3 || area == 4){
						// Mot of the field
						return multiplier(
							1.7, 2.6, 
							2.9, 3.82, 
							(4.2 * 2), (7.81 * 2), 
							4.2, 7.81, 
							2.2, 4.81, 
							6.9, 9.61)
					} else if (area == 5){
						// Red Zone
						return multiplier(
							1.7, 2.6, 
							3.9, 4.82, 
							(6.9 * 2), (9.61 * 2), 
							5.9, 7.61, 
							2.2, 4.81, 
							2.9, 3.61)
					} else if (area == 6)	{
						// Goal Line
						return multiplier(
							1.7, 2.6, 
							3.9, 4.82,  
							(10.9 * 2), (13.61 * 2), 
							3.9, 5.61, 
							2.2, 4.81, 
							2.9, 3.61)
					}
				} 

				// 1-2 Yards
				else if (yards == 2){
					if(area == 1){
						// Danger zone
						return multiplier(
							1.7, 2.6, 
							3.9, 4.82, 
							(3.9 * 2), (6.61 * 2), 
							5.9, 8.61, 
							2.2, 4.81, 
							15.9, 23.61)
					} else if (area == 2){
						// Most of the field 11 - 80 yard
						return multiplier(
							1.7, 2.6, 
							2.9, 3.82, 
							(4.2 * 2), (7.81 * 2), 
							4.2, 7.81, 
							2.2, 4.81, 
							10.9, 12.61)
					} else if (area == 3 || area == 4){
						// Mot of the field
						return multiplier(
							1.7, 2.6, 
							2.9, 3.82, 
							(4.2 * 2), (7.81 * 2), 
							4.2, 7.81, 
							2.2, 4.81, 
							6.9, 9.61)
					} else if (area == 5){
						// Red Zone
						return multiplier(
							1.7, 2.6, 
							3.9, 4.82, 
							(6.9 * 2), (9.61 * 2), 
							5.9, 7.61, 
							2.2, 4.81, 
							2.9, 3.61)
					} else if (area == 6)	{
						// Goal Line
						return multiplier(
							1.7, 2.6, 
							3.9, 4.82,  
							(7.9 * 2), (10.61 * 2), 
							3.9, 5.61, 
							2.2, 4.81, 
							2.9, 3.61)
					}
				} 

				// 3-5 Yards
				else if (yards == 3){
					if(area == 1){
						// Danger zone
						return multiplier(
							1.7, 2.6, 
							4.9, 5.82, 
							(5.9 * 2), (6.61 * 2), 
							5.9, 8.61, 
							2.2, 4.81, 
							15.9, 23.61)
					} else if (area == 2){
						// Most of the field 11 - 80 yard
						return multiplier(
							1.7, 2.6, 
							2.9, 3.82, 
							(4.2 * 2), (7.81 * 2), 
							4.2, 7.81, 
							2.2, 4.81, 
							10.9, 12.61)
					} else if (area == 3 || area == 4){
						// Mot of the field
						return multiplier(
							1.7, 2.6, 
							2.9, 3.82, 
							(4.2 * 2), (7.81 * 2), 
							4.2, 7.81, 
							2.2, 4.81, 
							6.9, 9.61)
					} else if (area == 5){
						// Red Zone
						return multiplier(
							1.7, 2.6, 
							3.9, 4.82, 
							(6.9 * 2), (9.61 * 2), 
							5.9, 7.61, 
							2.2, 4.81, 
							2.9, 3.61)
					} else if (area == 6)	{
						// Goal Line
						return multiplier(
							1.7, 2.6, 
							3.9, 4.82,  
							(7.9 * 2), (10.61 * 2), 
							3.9, 5.61, 
							2.2, 4.81, 
							2.9, 3.61)
					}
				} 
				
				// 6-9 Yards
				else if (yards == 4){
					if(area == 1){
						// Danger zone
						return multiplier(
							1.7, 2.6, 
							5.9, 6.82, 
							(5.9 * 2), (8.61 * 2), 
							5.9, 8.61, 
							2.2, 4.81, 
							15.9, 23.61)
					} else if (area == 2){
						// Most of the field 11 - 80 yard
						return multiplier(
							1.7, 2.6, 
							3.9, 5.82, 
							(4.2 * 2), (7.81 * 2), 
							4.2, 7.81, 
							2.2, 4.81, 
							10.9, 12.61)
					} else if (area == 3 || area == 4){
						// Mot of the field
						return multiplier(
							1.7, 2.6, 
							2.9, 3.82, 
							(4.2 * 2), (7.81 * 2), 
							4.2, 7.81, 
							2.2, 4.81, 
							6.9, 9.61)
					} else if (area == 5){
						// Red Zone
						return multiplier(
							1.7, 2.6, 
							4.9, 6.82, 
							(6.9 * 2), (9.61 * 2), 
							5.9, 7.61, 
							2.2, 4.81, 
							2.9, 3.61)
					} else if (area == 6)	{
						// Goal Line
						return multiplier(
							1.7, 2.6, 
							3.9, 4.82,  
							(7.9 * 2), (10.61 * 2), 
							3.9, 5.61, 
							2.2, 4.81, 
							2.9, 3.61)
					}
				} 

				// 10-15 Yards
				else if (yards == 5){
					if(area == 1){
						// Danger zone
						return multiplier(
							1.7, 2.6, 
							6.9, 8.82, 
							(5.9 * 2), (8.61 * 2), 
							5.9, 8.61, 
							2.2, 4.81, 
							15.9, 23.61)
					} else if (area == 2){
						// Most of the field 11 - 80 yard
						return multiplier(
							1.7, 2.6, 
							4.9, 6.82, 
							(4.2 * 2), (7.81 * 2), 
							4.2, 7.81, 
							2.2, 4.81, 
							10.9, 12.61)
					} else if (area == 3 || area == 4){
						// Mot of the field
						return multiplier(
							1.7, 2.6, 
							4.9, 5.82, 
							(4.2 * 2), (7.81 * 2), 
							4.2, 7.81, 
							2.2, 4.81, 
							6.9, 9.61)
					} else if (area == 5){
						// Red Zone
						return multiplier(
							1.7, 2.6, 
							3.9, 5.82, 
							(6.9 * 2), (9.61 * 2), 
							5.9, 7.61, 
							2.2, 4.81, 
							2.9, 3.61)
					} else if (area == 6)	{
						// Goal Line
						return multiplier(
							1.7, 2.6, 
							3.9, 4.82,  
							(7.9 * 2), (10.61 * 2), 
							3.9, 5.61, 
							2.2, 4.81, 
							2.9, 3.61)
					}
				} 

				// 15+ Yards
				else if (yards == 6){
					if(area == 1){
						// Danger zone
						return multiplier(
							1.7, 2.6, 
							5.9, 9.82, 
							(5.9 * 2), (8.61 * 2), 
							5.9, 8.61, 
							2.2, 4.81, 
							15.9, 23.61)
					} else if (area == 2){
						// Most of the field 11 - 80 yard
						return multiplier(
							1.7, 2.6, 
							4.9, 9.82, 
							(4.2 * 2), (7.81 * 2), 
							4.2, 7.81, 
							2.2, 4.81, 
							10.9, 12.61)
					} else if (area == 3 || area == 4){
						// Mot of the field
						return multiplier(
							1.7, 2.6, 
							4.9, 7.82, 
							(4.2 * 2), (7.81 * 2), 
							4.2, 7.81, 
							2.2, 4.81, 
							6.9, 9.61)
					} else if (area == 5){
						// Red Zone
						return multiplier(
							1.7, 2.6, 
							6.9, 10.82, 
							(6.9 * 2), (9.61 * 2), 
							5.9, 7.61, 
							2.2, 4.81, 
							2.9, 3.61)
					} else if (area == 6)	{
						// Goal Line
						return multiplier(
							1.7, 2.6, 
							5.9, 12.82,  
							(7.9 * 2), (10.61 * 2), 
							3.9, 5.61, 
							2.2, 4.81, 
							2.9, 3.61)
					}
				}
			 
			// Fourth Down
			} else if (down == 4 && area >= 4) {
				return multiplier(
					1.7, 1.7, 
					2.4, 3.42, 
					2.2, 3.81, 
					7.9, 11.61, 
					2.2, 4.81, 
					4.2, 8.61)
			} else if (down == 4 && area < 4) {
				return multiplier(
					1.7, 1.5, 
					1.7, 2.32, 
					3.2, 4.81, 
					9.9, 15.61, 
					5.9, 9.81, 
					15.9, 21.61)
			} 

			// Point After
			else if (down == 5){
				return multiplier(
					1.7, 1.7, 
					6.4, 12.42, 
					8.2, 14.81, 
					6.9, 10.61, 
					6.2, 10.81, 
					2.9, 3.61)
			}	

			// Kickoff
			else if (down == 6){
				// if(time < 5){
					return multiplier(
						1.5, 1.5, 
						2.4, 3.42, 
						5.2, 9.81, 
						8.9, 15.61, 
						12.2, 24.81, 
						29.9, 42.61)
				// } else if (time == 5) {
				// 	return multiplier(
				// 		1.5, 1.5, 
				// 		2.4, 3.42, 
				// 		5.2, 9.81, 
				// 		2.9, 4.61,  
				// 		2.2, 4.81, 
				// 		9.9, 12.61)
				// } 
			}
		}
		
		var arealoop = function (input, inputText) {
			var areaCounter = 1
			for (var i = 1; i <= input; i++) {
				counter += 1

				var inputs = {"down": downCounter, "yards": yardsCounter, "area": areaCounter} 
				var multiplier = multipliers(downCounter, yardsCounter, areaCounter)
				
				Meteor.call('createMultipliers', inputs, multiplier)
				areaCounter += 1
			}			
		}
		var loop = function (input, inputText) {
			yardsCounter = 1
			for (var i = 1; i <= input; i++) {
				
				arealoop(area, "Area")
				yardsCounter += 1
			}			
		}
		var allPlays = function (){
			for (var i = 1; i <= down; i++) {
				// console.log("---------------- Down" + " " + i + "--------------------")
				loop(yards, "Yards")
				downCounter += 1
			}
		}
		allPlays()

	}
});