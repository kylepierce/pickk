Template.createQuestion.events({
	'click [data-action=createQuestion]': function(e, t){
		// Turn off reload
		event.preventDefault();
		var gameId = Router.current().params._id

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
	}
});