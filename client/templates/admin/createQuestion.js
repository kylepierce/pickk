Template.createQuestion.events({
	'click [data-action=createQuestion]': function(e, t){
		// Turn off reload
		event.preventDefault();
		var gameId = Router.current().params._id
		var game = Games.findOne({});
		var period = parseInt(Router.current().params.period)

		// Capture the current situation in the game
		var inputsObj = {}
		var inputs = ["down", "yards", "area", "style"]

		inputs.map(function (input){
			var text = "input[name=" + input + "]"
			var inputValue = t.find(text).value
			inputsObj[input] = inputValue
		});

		// One object to be passed to the insertQuestion method.
		var q = {
			gameId: gameId,
			period: period,
			commercial: false,
			active: true,
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
	'click [data-action=kickoff]': function (e,t){
		// Turn off reload
		event.preventDefault();
		var gameId = Router.current().params._id
		var game = Games.findOne({});
		var period = parseInt(Router.current().params.period)
		var style = t.find("input[name=style]").value
		var inputsObj = {
			down: 6,
			area: 1,
			style: style,
			yards: 1
		}
		// One object to be passed to the insertQuestion method.
		var q = {
			gameId: gameId,
			period: period,
			commercial: false,
			active: true,
			type: "play",
			inputs: inputsObj
		}	

		Meteor.call('insertQuestion', q, function(e, r){
		if(!e){
				Meteor.call("questionPush", q.gameId, r)
				Meteor.call("emptyInactive", q.gameId)
			}
		});
	},
	'click [data-action=PAT]': function (e,t){
		// Turn off reload
		event.preventDefault();
		var gameId = Router.current().params._id
		var game = Games.findOne({});
		var period = parseInt(Router.current().params.period)
		var style = t.find("input[name=style]").value
		var inputsObj = {
			down: 5,
			area: 1,
			style: style,
			yards: 1
		}
		// One object to be passed to the insertQuestion method.
		var q = {
			gameId: gameId,
			period: period,
			commercial: false,
			active: true,
			type: "play",
			inputs: inputsObj
		}	

		Meteor.call('insertQuestion', q, function(e, r){
		if(!e){
				Meteor.call("questionPush", q.gameId, r)
				Meteor.call("emptyInactive", q.gameId)
			}
		});
	}
});