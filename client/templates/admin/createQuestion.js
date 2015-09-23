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
						8.9, 11.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						2.2, 4.81, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						6.9, 8.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						2.2, 4.81, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						2.2, 4.81, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
						2.2, 3.81, 
						(2.2 * 2), (3.81 * 2), 
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
						2.9, 3.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						2.2, 4.81, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						6.9, 8.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						2.2, 4.81, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						2.2, 4.81, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
						2.2, 3.81, 
						(2.2 * 2), (3.81 * 2), 
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
						2.9, 3.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						2.2, 4.81, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						6.9, 8.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						2.2, 4.81, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						2.2, 4.81, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
						2.2, 3.81, 
						(2.2 * 2), (3.81 * 2), 
						2.2, 4.81, 
						1.9, 2.61)
				}
			} 

			// 6-9 Yards
			else if (yards == 4){
				if(area == 1){
					// Danger zone
					multiplier(1.1, 1.3,
					 1.4, 2.42,
					 3.2, 4.81, 
					 2.9, 3.61, 
					 (2.9 * 2), (3.61 * 2), 
					 2.9, 3.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						2.2, 4.81, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						6.9, 8.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						2.2, 4.81, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(1.1, 1.7,
					 1.4, 1.92,
					 2.2, 4.81, 
					 2.9, 4.61, 
					 (2.9 * 2), (4.61 * 2), 
					 2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(1.3, 1.9,
					 1.4, 2.42,
					 2.2, 3.81, 
					 3.9, 5.61, 
					 (3.9 * 2), (5.61 * 2), 
					 1.9, 2.61)
				}
			} 

			// 10-15 Yards
			else if (yards == 5){
				if(area == 1){
					// Danger zone
					multiplier(1.1, 1.3, 
						1.4, 2.42, 
						3.2, 4.81, 
						2.9, 3.61, 
						(2.9 * 2), (3.61 * 2), 
						2.9, 3.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						2.2, 4.81, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						6.9, 8.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						2.2, 4.81, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(1.1, 1.7, 
						1.4, 1.92, 
						2.2, 4.81, 
						2.9, 4.61, 
						(2.9 * 2), (4.61 * 2), 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(1.3, 1.9, 
						1.4, 2.42, 
						2.2, 3.81, 
						3.9, 5.61, 
						(3.9 * 2), (5.61 * 2), 
						1.9, 2.61)
				}
			} 

			// 15+ Yards
			else if (yards == 6){
				if(area == 1){
					// Danger zone
					multiplier(1.1, 1.3, 
						1.4, 2.42, 
						3.2, 4.81, 
						2.9, 3.61, 
						(2.9 * 2), (3.61 * 2), 
						2.9, 3.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						2.2, 4.81, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						6.9, 8.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						2.2, 4.81, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(1.1, 1.7, 
						1.4, 1.92, 
						2.2, 4.81, 
						2.9, 4.61, 
						(2.9 * 2), (4.61 * 2), 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(1.3, 1.9, 
						1.4, 2.42, 
						2.2, 3.81, 
						3.9, 5.61, 
						(3.9 * 2), (5.61 * 2), 
						1.9, 2.61)
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
						2.9, 3.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						6.9, 8.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(2.9 * 2), (4.61 * 2), 
						2.9, 4.61, 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
						(3.9 * 2), (5.61 * 2), 
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
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						6.9, 8.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(2.9 * 2), (4.61 * 2), 
						2.9, 4.61, 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
						(3.9 * 2), (5.61 * 2), 
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
						2.9, 3.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						6.9, 8.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(2.9 * 2), (4.61 * 2), 
						2.9, 4.61, 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
						(3.9 * 2), (5.61 * 2), 
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
						2.9, 3.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						6.9, 8.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(2.9 * 2), (4.61 * 2), 
						2.9, 4.61, 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
						(3.9 * 2), (5.61 * 2), 
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
						2.9, 3.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						6.9, 8.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(2.9 * 2), (4.61 * 2), 
						2.9, 4.61, 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
						(3.9 * 2), (5.61 * 2), 
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
						2.9, 3.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						6.9, 8.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(2.9 * 2), (4.61 * 2), 
						2.9, 4.61, 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
						(3.9 * 2), (5.61 * 2), 
						3.9, 5.61, 
						2.2, 4.81, 
						1.9, 2.61)
				}
			}
		} 

// Third Down
		else if(down == 3){
			question = "Third Down ..."
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
						2.9, 3.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						6.9, 8.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(2.9 * 2), (4.61 * 2), 
						2.9, 4.61, 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
						(3.9 * 2), (5.61 * 2), 
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
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						6.9, 8.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(2.9 * 2), (4.61 * 2), 
						2.9, 4.61, 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
						(3.9 * 2), (5.61 * 2), 
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
						2.9, 3.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						6.9, 8.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(2.9 * 2), (4.61 * 2), 
						2.9, 4.61, 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
						(3.9 * 2), (5.61 * 2), 
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
						2.9, 3.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						6.9, 8.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(2.9 * 2), (4.61 * 2), 
						2.9, 4.61, 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
						(3.9 * 2), (5.61 * 2), 
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
						2.9, 3.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						6.9, 8.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(2.9 * 2), (4.61 * 2), 
						2.9, 4.61, 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
						(3.9 * 2), (5.61 * 2), 
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
						2.9, 3.61)
				} else if (area == 2){
					// Most of the field 11 - 80 yard
					multiplier(
						1.3, 1.9, 
						1.6, 2.02, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						6.9, 8.61)
				} else if (area == 3 || area == 4){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(2.2 * 2), (4.81 * 2), 
						2.2, 4.81, 
						2.2, 4.81, 
						4.9, 7.61)
				} else if (area == 5){
					// Red Zone
					multiplier(
						1.1, 1.7, 
						1.4, 1.92, 
						(2.9 * 2), (4.61 * 2), 
						2.9, 4.61, 
						2.2, 4.81, 
						2.9, 3.61)
				} else if (area == 6)	{
					// Goal Line
					multiplier(
						1.3, 1.9, 
						1.4, 2.42, 
						(3.9 * 2), (5.61 * 2), 
						3.9, 5.61, 
						2.2, 4.81, 
						1.9, 2.61)
				}
			}
		 
// Fourth Down
		} else if (down == 4 && area >= 4) {
			question = "4th Down..."
			console.log(question)
			questionList("Kick Good!", "Run", "Pass", "Fumble", "Touchdown", "Miss/Blocked Kick")
			multiplier(
				1.3, 1.7, 
				2.4, 3.42, 
				2.2, 3.81, 
				3.9, 5.61, 
				5.2, 7.81, 
				2.2, 3.61)
		} else if (down == 4 && area < 4) {
			question = "4th Down..."
			console.log(question)
			questionList("0-29 Yard Return", "30+ Return", "Fake (Run)", "Blocked Punt", "Fumble",  "Return Touchdown")
			multiplier(
				1.3, 1.9, 
				3.3, 4.92, 
				2.2, 4.81, 
				3.9, 5.61, 
				2.9, 4.81, 
				8.9, 11.61)
		} 

// Point After
		else if (down == 5){
			question = "Point after"
			console.log(question)
			questionList("Kick Good!", "Fake (Run)", "Fake (Pass)", "Blocked/Missed Kick", "Two Point Good", "Two Point No Good")
			multiplier(
				1.3, 1.7, 
				1.4, 2.42, 
				2.2, 4.81, 
				2.9, 3.61, 
				2.2, 4.81, 
				2.9, 3.61)
		}	

// Kickoff
		else if (down == 6){
			question = "Kick off..."
			console.log(question)
			questionList("Touchback", "0-29 Return",  "30+ Return", "Touchdown", "Fumble", "Kicking Team Touchdown")
			multiplier(
				1.1, 1.5, 
				1.4, 2.42, 
				3.2, 5.81, 
				8.9, 11.61, 
				2.2, 4.81, 
				9.9, 12.61)
		}

		// Meteor.call("questionPush", game, question)
		// Meteor.call("emptyInactive", game, question)
		Meteor.call('insertQuestion', game, question, option1, multi1, option2, multi2, option3, multi3, option4, multi4, option5, multi5, option6, multi6);
	} 
});