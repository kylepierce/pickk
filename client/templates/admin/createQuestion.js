Template.createQuestion.events({
	'click [data-action="startCommercialBreak"]': function(event, template){
		// Turn off reload
		event.preventDefault();
		var game = template.find('#gameList :selected').value
		Meteor.call('toggleCommercial', game, true);
	},

	'click [data-action="endCommercialBreak"]': function(event, template){
		// Turn off reload
		event.preventDefault();
		var game = template.find('#gameList :selected').value
		Meteor.call('toggleCommercial', game, false);
	},

	'click [data-action="situationalQuestion"]': function(event, template){
		var que = prompt('Question you would like to ask')
		var game = template.find('#gameList :selected').value
		console.log(que)
		console.log(game)
		Meteor.call('createTrueFalse', que, game)
	},

	'click [data-action="thisDrive"]': function(event, template){
				event.preventDefault();
		var down = template.find('input[name=down]').value
		var yards = template.find('input[name=yards]').value
		var area = template.find('input[name=area]').value
		var time = template.find('input[name=time]').value
		var game = template.find('#gameList :selected').value

		var question, option1, option2, option3, option4, option5, option6, multi1, multi2, multi3, multi4, multi5, multi6

		function questionList(o1, o2, o3, o4, o5, o6){
			option1 = o1
			option2 = o2
			option3 = o3
			option4 = o4
			option5 = o5
			option6 = o6
		}

		function randomizer(min, max){
			return (Math.random() * (max-min) + min).toFixed(2)
		}

		function multiplier(m1a, m1b, m2a, m2b, m3a, m3b, m4a, m4b, m5a, m5b, m6a, m6b){
			multi1 = randomizer(m1a, m1b)
			multi2 = randomizer(m2a, m2b)
			multi3 = randomizer(m3a, m3b)
			multi4 = randomizer(m4a, m4b)
			multi5 = randomizer(m5a, m5b)
			multi6 = randomizer(m6a, m6b)
		}

		question = "How Will This Drive End?"
		questionList("Punt", "Interception", "Fumble", "Touchdown", "Field Goal", "Other")

		multiplier(
						1.1, 1.3, 
						3.4, 5.42, 
						3.2, 4.81, 
						2.2, 4.81, 
						2.2, 4.81, 
						2.9, 4.61)

		Meteor.call("questionPush", game, question)
		Meteor.call("emptyInactive", game, question)
		Meteor.call('insertQuestion', game, question, true, option1, multi1, option2, multi2, option3, multi3, option4, multi4, option5, multi5, option6, multi6);
 
	},

	'click [data-action=createQuestion]': function(event, template){
		// Turn off reload
		event.preventDefault();
		var down = template.find('input[name=down]').value
		var yards = template.find('input[name=yards]').value
		var area = template.find('input[name=area]').value
		var time = template.find('input[name=time]').value
		var game = template.find('#gameList :selected').value

		console.log(game)

		var question, option1, option2, option3, option4, option5, option6, multi1, multi2, multi3, multi4, multi5, multi6

		function questionList(o1, o2, o3, o4, o5, o6){
			option1 = o1
			option2 = o2
			option3 = o3
			option4 = o4
			option5 = o5
			option6 = o6
		}

		function randomizer(min, max){
			return (Math.random() * (max-min) + min).toFixed(2)
		}

		function multiplier(m1a, m1b, m2a, m2b, m3a, m3b, m4a, m4b, m5a, m5b, m6a, m6b){
			multi1 = randomizer(m1a, m1b)
			multi2 = randomizer(m2a, m2b)
			multi3 = randomizer(m3a, m3b)
			multi4 = randomizer(m4a, m4b)
			multi5 = randomizer(m5a, m5b)
			multi6 = randomizer(m6a, m6b)
		}

//First Down
		if(down == 1){
			question = "First Down ..."
			questionList("Run", "Pass", "Interception", "Pick Six", "Fumble", "Touchdown")

			// Inches
			if(yards == 1){
				if(area == 1){
					// Danger zone
					multiplier(
						1.1, 1.3, 
						1.4, 2.42, 
						3.2, 4.81, 
						(3.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						15.9, 21.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						2.2, 4.81, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						11.9, 18.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						2.2, 4.81, 
						(4.2 * 2), (8.81 * 2), 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						2.2, 4.81, 
						(4.2 * 2), (8.81 * 2), 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
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
					multiplier(
						1.1, 1.3, 
						1.4, 2.42, 
						3.2, 4.81, 
						(3.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						12.9, 23.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						2.2, 4.81, 
						(8.2 * 2), (10.81 * 2), 
						2.2, 4.81, 
						16.9, 18.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						2.2, 4.81, 
						(10.2 * 2), (14.81 * 2), 
						2.2, 4.81, 
						8.9, 12.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						2.2, 4.81, 
						(12.2 * 2), (16.81 * 2), 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
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
					multiplier(
						1.1, 1.3, 
						1.4, 2.42, 
						3.2, 4.81, 
						(3.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						13.9, 15.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						2.2, 4.81, 
						(5.2 * 2), (8.81 * 2), 
						2.2, 4.81, 
						10.9, 13.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						2.2, 4.81, 
						(6.2 * 2), (8.81 * 2), 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						2.2, 4.81, 
						(12.2 * 2), (14.81 * 2), 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
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
					multiplier(
					 1.1, 1.3,
					 1.4, 2.42,
					 3.2, 4.81, 
					 (2.9 * 2), (3.61 * 2), 
					 2.9, 3.61, 
					 14.9, 18.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						2.2, 4.81, 
						(4.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						12.9, 15.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						2.2, 4.81, 
						(6.2 * 2), (8.81 * 2), 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7,
					 1.4, 1.92,
					 2.2, 4.81, 
					 (12.9 * 2), (14.61 * 2), 
					 2.9, 4.61, 
					 2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9,
					 1.4, 2.42,
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
					multiplier(
						1.1, 1.3, 
						1.4, 2.42, 
						3.2, 4.81, 
						(2.9 * 2), (3.61 * 2),
						2.9, 3.61, 
						12.9, 13.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						2.2, 4.81, 
						(2.2 * 2), (5.81 * 2), 
						2.2, 4.81, 
						8.9, 12.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						2.2, 4.81, 
						(5.2 * 2), (8.81 * 2), 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						2.2, 4.81, 
						(8.9 * 2), (11.61 * 2),
						2.9, 4.61, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
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
					multiplier(
						1.1, 1.3, 
						1.4, 2.42, 
						3.2, 4.81, 
						(2.9 * 2), (3.61 * 2), 
						2.9, 3.61, 
						12.9, 23.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						2.2, 4.81, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						9.9, 13.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						2.2, 4.81, 
						(5.2 * 2), (6.81 * 2), 
						2.2, 4.81, 
						4.9, 9.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						2.2, 4.81, 
						(8.9 * 2), (13.61 * 2), 
						2.9, 4.61, 
						2.9, 4.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
						2.2, 3.81, 
						(13.9 * 2), (15.61 * 2), 
						3.9, 5.61, 
						1.9, 2.61)
				}
			}
		} 

// Second Down with sack option
		else if(down == 2 && time == 2){
			question = "Second Down ..."
			questionList("Negative Yards", "0-5 Yard Run", "6-20 Yard Run", "0-5 Yard Pass/Incomplete", "6-20 Yard Pass", "21+ Gain (Run or Pass)")

			// Inches
			if(yards == 1){
				if(area == 1){
					// Danger zone
					multiplier(
						2.1, 3.3, 
						1.4, 2.42, 
						2.4, 4.0,
						2.9, 3.61, 
						2.2, 4.81, 
						3.9, 7.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						2.3, 3.9, 
						1.6, 2.02, 
						2.0, 3.5,
						2.2, 4.81, 
						2.2, 4.81, 
						6.9, 8.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						2.1, 3.7, 
						1.4, 1.92, 
						2.0, 3.4,
						2.2, 4.81, 
						2.2, 4.81, 
						5.9, 8.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						2.1, 3.7, 
						1.4, 1.92, 
						2.2, 3.6,
						2.9, 4.61, 
						2.2, 4.81, 
						3.9, 4.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						2.3, 2.9, 
						1.4, 2.42, 
						2.2, 3.5,
						3.9, 5.61, 
						2.2, 4.81, 
						2.9, 3.61)
				}
			} 

			// 1-2 Yards
			else if (yards == 2){
				if(area == 1){
					// Danger zone
					multiplier(
						2.1, 3.3, 
						1.4, 2.42, 
						2.5, 4.2,
						2.9, 3.61, 
						2.2, 4.81, 
						3.9, 7.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						2.3, 3.9, 
						1.6, 2.02, 
						2.5, 4.2,
						2.2, 4.81, 
						2.2, 4.81, 
						6.9, 8.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						2.1, 3.7, 
						1.4, 1.92, 
						2.5, 4.2,
						2.2, 4.81, 
						2.2, 4.81, 
						5.9, 8.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						2.1, 3.7, 
						1.4, 1.92, 
						2.5, 4.2,
						2.9, 4.61, 
						2.2, 4.81, 
						3.9, 5.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						2.3, 3.9, 
						1.4, 2.42, 
						2.5, 4.2,
						3.9, 5.61, 
						2.2, 4.81, 
						2.9, 3.61)
				}
			} 

			// 3-5 Yards
			else if (yards == 3){
				if(area == 1){
					// Danger zone
					multiplier(
						2.1, 3.3, 
						1.4, 2.42, 
						2.5, 4.2,
						2.9, 3.61, 
						2.2, 4.81, 
						3.9, 7.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						2.3, 3.9, 
						1.6, 2.02, 
						2.5, 4.2,	
						2.2, 4.81, 
						2.2, 4.81, 
						6.9, 8.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.7, 2.7, 
						1.4, 1.92, 
						2.5, 4.2,			
						2.2, 4.81, 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						2.1, 3.7, 
						1.4, 1.92, 
						2.5, 4.2,		
						2.9, 4.61, 
						2.2, 4.81, 
						3.9, 7.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
						2.5, 4.2,		
						3.9, 5.61, 
						2.2, 4.81, 
						2.9, 3.61)
				}
			} 
			
			// 6-9 Yards
			else if (yards == 4){
				if(area == 1){
					// Danger zone
					multiplier(
						2.1, 3.3, 
						1.4, 2.42, 
						2.5, 4.2,		
						2.9, 3.61, 
						2.2, 4.81, 
						3.9, 7.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						2.5, 4.2,			
						2.2, 4.81, 
						2.2, 4.81, 
						6.9, 8.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						2.1, 3.7, 
						1.4, 1.92, 
						2.5, 4.2,	
						2.2, 4.81, 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.8, 2.7, 
						1.4, 1.92, 
						2.5, 4.2,			
						2.9, 4.61, 
						2.2, 4.81, 
						3.9, 7.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						2.3, 3.9, 
						1.4, 2.42, 
						2.5, 4.2,		 
						3.9, 5.61, 
						2.2, 4.81, 
						3.9, 7.61)
				}
			} 

			// 10-15 Yards
			else if (yards == 5){
				if(area == 1){
					// Danger zone
					multiplier(
						2.1, 3.3, 
						1.4, 2.42, 
						2.5, 4.2,	
						2.9, 3.61, 
						2.2, 4.81, 
						3.9, 7.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						2.5, 4.2,			
						2.2, 4.81, 
						2.2, 4.81, 
						3.9, 7.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						2.1, 2.7, 
						1.4, 1.92, 
						2.5, 4.2,			
						2.2, 4.81, 
						2.2, 4.81, 
						5.9, 8.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.8, 2.7, 
						1.4, 1.92, 
						2.5, 4.2,				
						2.9, 4.61, 
						2.2, 4.81, 
						3.9, 7.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						2.3, 2.9, 
						1.4, 2.42, 
						2.5, 4.2,			
						3.9, 5.61, 
						2.2, 4.81, 
						3.9, 7.61)
				}
			} 

			// 15+ Yards
			else if (yards == 6){
				if(area == 1){
					// Danger zone
					multiplier(
						2.1, 4.3, 
						1.4, 2.42, 
						2.5, 4.2,			
						2.9, 3.61, 
						2.2, 4.81, 
						3.9, 5.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						2.5, 4.2,		
						2.2, 4.81, 
						2.2, 4.81, 
						3.9, 5.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						2.5, 4.2,			
						2.2, 4.81, 
						2.2, 4.81, 
						3.9, 5.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						2.5, 4.2,			
						2.9, 4.61, 
						2.2, 4.81, 
						3.9, 5.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
						2.5, 4.2,				
						3.9, 5.61, 
						2.2, 4.81, 
						2.9, 3.61)
				}
			}
		} 

// Second Down
		else if(down == 2){
			question = "Second Down ..."
			questionList("Run", "Pass", "Pick Six", "Interception", "Fumble", "Touchdown")

			// Inches
			if(yards == 1){
				if(area == 1){
					// Danger zone
					multiplier(
						1.1, 1.3, 
						1.4, 2.42, 
						(2.9 * 2), (3.61 * 2), 
						2.9, 3.61, 
						2.2, 4.81, 
						12.9, 15.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						6.9, 12.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(5.2 * 2), (9.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(8.9 * 2), (13.61 * 2), 
						2.9, 4.61, 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
						(13.9 * 2), (15.61 * 2), 
						3.9, 5.61, 
						2.2, 4.81, 
						1.9, 2.61)
				}
			} 

			// 1-2 Yards
			else if (yards == 2){
				if(area == 1){
					// Danger zone
					multiplier(
						1.1, 1.3, 
						1.4, 2.42, 
						(2.9 * 2), (3.61 * 2), 
						2.9, 3.61, 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						(3.2 * 2), (5.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						6.9, 8.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(5.2 * 2), (9.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(9.9 * 2), (14.61 * 2), 
						2.9, 4.61, 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
						(13.9 * 2), (18.61 * 2), 
						3.9, 5.61, 
						2.2, 4.81, 
						1.9, 2.61)
				}
			} 

			// 3-5 Yards
			else if (yards == 3){
				if(area == 1){
					// Danger zone
					multiplier(
						1.1, 1.3, 
						1.4, 2.42, 
						(2.9 * 2), (3.61 * 2), 
						2.9, 3.61, 
						2.2, 4.81, 
						12.9, 15.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						8.9, 12.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(4.2 * 2), (8.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						6.9, 9.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(9.9 * 2), (12.61 * 2), 
						2.9, 4.61, 
						2.2, 4.81, 
						3.9, 4.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
						(13.9 * 2), (15.61 * 2), 
						3.9, 5.61, 
						2.2, 4.81, 
						1.9, 2.61)
				}
			} 
			
			// 6-9 Yards
			else if (yards == 4){
				if(area == 1){
					// Danger zone
					multiplier(
						1.1, 1.3, 
						1.4, 2.42, 
						(2.9 * 2), (3.61 * 2), 
						2.9, 3.61, 
						2.2, 4.81, 
						12.9, 15.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						8.9, 12.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(4.2 * 2), (8.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(8.9 * 2), (12.61 * 2), 
						2.9, 4.61, 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
						(13.9 * 2), (15.61 * 2), 
						3.9, 5.61, 
						2.2, 4.81, 
						1.9, 2.61)
				}
			} 

			// 10-15 Yards
			else if (yards == 5){
				if(area == 1){
					// Danger zone
					multiplier(
						1.1, 1.3, 
						1.4, 2.42, 
						(2.9 * 2), (3.61 * 2), 
						2.9, 3.61, 
						2.2, 4.81, 
						12.9, 15.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						6.9, 12.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(6.2 * 2), (8.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(9.9 * 2), (12.61 * 2), 
						2.9, 4.61, 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
						(13.9 * 2), (15.61 * 2), 
						3.9, 5.61, 
						2.2, 4.81, 
						1.9, 2.61)
				}
			} 

			// 15+ Yards
			else if (yards == 6){
				if(area == 1){
					// Danger zone
					multiplier(
						1.1, 1.3, 
						1.4, 2.42, 
						(2.9 * 2), (3.61 * 2), 
						2.9, 3.61, 
						2.2, 4.81, 
						12.9, 15.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						8.9, 12.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(5.2 * 2), (8.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(8.9 * 2), (12.61 * 2), 
						2.9, 4.61, 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
						(13.9 * 2), (15.61 * 2), 
						3.9, 5.61, 
						2.2, 4.81, 
						1.9, 2.61)
				}
			}
		} 

		else if(down == 3 && area == 6){
			question = "Third Down ..."
			questionList("Run", "Pass", "Pick Six", "Interception", "Fumble", "Touchdown")
			multiplier(
				1.7, 2.6, 
				3.9, 4.82, 
				(5.9 * 2), (8.61 * 2), 
				5.9, 8.61, 
				2.2, 4.81, 
				2.9, 4.61)
		}

// Third Down
		else if(down == 3){
			question = "Third Down ..."
			questionList("Unable to Covert First Down", "Convert to First Down", "Pick Six", "Interception", "Fumble", "Touchdown")

			// Inches
			if(yards == 1){
				if(area == 1){
					// Danger zone
					multiplier(
						1.7, 2.6, 
						3.9, 4.82, 
						(5.9 * 2), (8.61 * 2), 
						5.9, 8.61, 
						2.2, 4.81, 
						15.9, 23.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.7, 2.6, 
						2.9, 3.82, 
						(4.2 * 2), (7.81 * 2), 
						4.2, 7.81, 
						2.2, 4.81, 
						10.9, 12.61)
				} else if (area == 3 || area == 4){
					// Mot of the field
					multiplier(
						1.7, 2.6, 
						2.9, 3.82, 
						(4.2 * 2), (7.81 * 2), 
						4.2, 7.81, 
						2.2, 4.81, 
						6.9, 9.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.7, 2.6, 
						3.9, 4.82, 
						(6.9 * 2), (9.61 * 2), 
						5.9, 7.61, 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
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
					multiplier(
						1.7, 2.6, 
						3.9, 4.82, 
						(3.9 * 2), (6.61 * 2), 
						5.9, 8.61, 
						2.2, 4.81, 
						15.9, 23.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.7, 2.6, 
						2.9, 3.82, 
						(4.2 * 2), (7.81 * 2), 
						4.2, 7.81, 
						2.2, 4.81, 
						10.9, 12.61)
				} else if (area == 3 || area == 4){
					// Mot of the field
					multiplier(
						1.7, 2.6, 
						2.9, 3.82, 
						(4.2 * 2), (7.81 * 2), 
						4.2, 7.81, 
						2.2, 4.81, 
						6.9, 9.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.7, 2.6, 
						3.9, 4.82, 
						(6.9 * 2), (9.61 * 2), 
						5.9, 7.61, 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
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
					multiplier(
						1.7, 2.6, 
						4.9, 5.82, 
						(5.9 * 2), (6.61 * 2), 
						5.9, 8.61, 
						2.2, 4.81, 
						15.9, 23.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.7, 2.6, 
						2.9, 3.82, 
						(4.2 * 2), (7.81 * 2), 
						4.2, 7.81, 
						2.2, 4.81, 
						10.9, 12.61)
				} else if (area == 3 || area == 4){
					// Mot of the field
					multiplier(
						1.7, 2.6, 
						2.9, 3.82, 
						(4.2 * 2), (7.81 * 2), 
						4.2, 7.81, 
						2.2, 4.81, 
						6.9, 9.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.7, 2.6, 
						3.9, 4.82, 
						(6.9 * 2), (9.61 * 2), 
						5.9, 7.61, 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
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
					multiplier(
						1.7, 2.6, 
						5.9, 6.82, 
						(5.9 * 2), (8.61 * 2), 
						5.9, 8.61, 
						2.2, 4.81, 
						15.9, 23.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.7, 2.6, 
						3.9, 5.82, 
						(4.2 * 2), (7.81 * 2), 
						4.2, 7.81, 
						2.2, 4.81, 
						10.9, 12.61)
				} else if (area == 3 || area == 4){
					// Mot of the field
					multiplier(
						1.7, 2.6, 
						2.9, 3.82, 
						(4.2 * 2), (7.81 * 2), 
						4.2, 7.81, 
						2.2, 4.81, 
						6.9, 9.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.7, 2.6, 
						4.9, 6.82, 
						(6.9 * 2), (9.61 * 2), 
						5.9, 7.61, 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
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
					multiplier(
						1.7, 2.6, 
						6.9, 8.82, 
						(5.9 * 2), (8.61 * 2), 
						5.9, 8.61, 
						2.2, 4.81, 
						15.9, 23.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.7, 2.6, 
						4.9, 6.82, 
						(4.2 * 2), (7.81 * 2), 
						4.2, 7.81, 
						2.2, 4.81, 
						10.9, 12.61)
				} else if (area == 3 || area == 4){
					// Mot of the field
					multiplier(
						1.7, 2.6, 
						4.9, 5.82, 
						(4.2 * 2), (7.81 * 2), 
						4.2, 7.81, 
						2.2, 4.81, 
						6.9, 9.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.7, 2.6, 
						3.9, 5.82, 
						(6.9 * 2), (9.61 * 2), 
						5.9, 7.61, 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
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
					multiplier(
						1.7, 2.6, 
						5.9, 9.82, 
						(5.9 * 2), (8.61 * 2), 
						5.9, 8.61, 
						2.2, 4.81, 
						15.9, 23.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.7, 2.6, 
						4.9, 9.82, 
						(4.2 * 2), (7.81 * 2), 
						4.2, 7.81, 
						2.2, 4.81, 
						10.9, 12.61)
				} else if (area == 3 || area == 4){
					// Mot of the field
					multiplier(
						1.7, 2.6, 
						4.9, 7.82, 
						(4.2 * 2), (7.81 * 2), 
						4.2, 7.81, 
						2.2, 4.81, 
						6.9, 9.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.7, 2.6, 
						6.9, 10.82, 
						(6.9 * 2), (9.61 * 2), 
						5.9, 7.61, 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.7, 2.6, 
						5.9, 12.82,  
						(7.9 * 2), (10.61 * 2), 
						3.9, 5.61, 
						2.2, 4.81, 
						2.9, 3.61)
				}
			}
		 
// Fourth Down
		} else if (time == 4 && down == 4 && area >= 4) {
			question = "4th Down..."
			console.log(question)
			questionList("Kick Good!", "Run", "Pass", "Fumble", "Missed Kick", "/Blocked Kick")
			multiplier(
				1.3, 1.7, 
				2.4, 3.42, 
				2.2, 3.81, 
				8.9, 12.61, 
				2.2, 3.81, 
				2.2, 3.61)
		} else if (time == 4 && down == 4 && area < 4) {
			question = "4th Down..."
			console.log(question)
			questionList("Unable to Covert First Down", "Convert to First Down", "Pick Six", "Interception", "Fumble", "Touchdown")
			multiplier(
				1.3, 1.7, 
				4.4, 6.42, 
				9.2, 15.81, 
				3.9, 5.61, 
				3.2, 7.81, 
				6.2, 8.61)
		} else if (down == 4 && area >= 4) {
			question = "4th Down..."
			console.log(question)
			questionList("Kick Good!", "Run", "Pass", "Fumble", "Missed Kick", "Blocked Kick")
			multiplier(
				1.3, 1.7, 
				2.4, 3.42, 
				2.2, 3.81, 
				7.9, 11.61, 
				2.2, 4.81, 
				4.2, 8.61)
		} else if (down == 4 && area < 4) {
			question = "4th Down..."
			console.log(question)
			questionList("Fair Catch", "0-20 Yard Return", "21-40 Yard Return", "Blocked Punt", "Fumble",  "Touchdown")
			multiplier(
				1.3, 1.5, 
				1.7, 2.32, 
				3.2, 4.81, 
				9.9, 15.61, 
				5.9, 9.81, 
				15.9, 21.61)
		} 

// Point After
		else if (down == 5){
			question = "Point after"
			console.log(question)
			questionList("Kick Good!", "Fake Kick No Score", "Blocked Kick", "Missed Kick", "Two Point Good", "Two Point No Good")
			multiplier(
				1.3, 1.7, 
				6.4, 12.42, 
				8.2, 14.81, 
				6.9, 10.61, 
				6.2, 10.81, 
				2.9, 3.61)
		}	

// Kickoff
		else if (down == 6){
			if(time < 5){
				question = "Kick off..."
				questionList("Touchback", "0-25 Return",  "26-45 Return", "46+", "Fumble", "Touchdown")
				multiplier(
					1.1, 1.5, 
					2.4, 3.42, 
					5.2, 9.81, 
					8.9, 15.61, 
					12.2, 24.81, 
					29.9, 42.61)
			} else if (time == 5) {
				question = "Onside Kick..."
				questionList("Touchback", "5-10 Return",  "11+ Return", "Penalty", "Fumble Recovered by Reciving Team", "Kicking Team Recovers")
				multiplier(
					1.1, 1.5, 
					2.4, 3.42, 
					5.2, 9.81, 
					2.9, 4.61,  
					2.2, 4.81, 
					9.9, 12.61)
			} 
		}
		Meteor.call("questionPush", game, question)
		Meteor.call("emptyInactive", game, question)
		Meteor.call('insertQuestion', game, question, false, option1, multi1, option2, multi2, option3, multi3, option4, multi4, option5, multi5, option6, multi6);
	} 
});