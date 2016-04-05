Template.adminBaseball.events({
	'click [data-action=createBaseballQuestion]': function (event, template) {
		event.preventDefault();
		Meteor.call('createBaseballQuestion');
	}, 
	'click [data-action=createAtBat]': function (event, template) {
		event.preventDefault();
		var currentGame = Games.findOne({live: true});
	  var currentGameId = currentGame._id
	  console.log(currentGameId)
		Meteor.call('createAtBat', "playerId", currentGameId);
	},
	'click [data-action=createBaseballGame]': function (event, template) {
		event.preventDefault();
		Meteor.call('createBaseballGame', "team1", "team2", "dateOfGame", "timeOfGame", "tvStation");
	},
});

Template.adminBaseball.helpers ({
	atBat: function(){
		var atBat = AtBat.find({ }).fetch()
		return atBat
	}
})

Template.battingLineUp.helpers({
	batter: function () {
		// Find the current game and the team that is at bat.
		var currentGame = Games.findOne({live: true})

		var topOfInning = currentGame.topOfInning


		// Depending on inning postion pick the visitor (0) or home team (1).
		if( topOfInning === true ){
			var team = currentGame.teams[0]
		} else {
			var team = currentGame.teams[1]
		}

		// Find the Team
		// console.log(team)
		var teamId = team.teamId
		var team = Teams.findOne({_id: teamId})

		// Then Find the batting line up
		var battingLineUp = team.battingOrderLineUp

		// Store all of the players on a list 
		var playerList = []

		//For every name on the batter line up. Find the player id.
		for (var i = battingLineUp.length - 1; i >= 0; i--) {
			// Get the player
			var thisPlayer = battingLineUp[i]

			// Name and position
			var name = thisPlayer.name
			var position = thisPlayer.position

			// Get correct player info
	    var firstInitial = name.substring(0,1)
	    var lastName = name.substring(3)

	    var player = Players.findOne({teamId: teamId, position: position, lastName: lastName})

	    if(player){
	        // Check to make sure there is only 1 player
	        if ( player.length >= 2 ) {
	            console.log("There are multiple players returned")
	            var playerId = "Fake PlayerId"
	        } else {
	        	// console.log("player Obj " + player)
	        	// console.log("player Id " + player._id)
	        	// console.log(thisPlayer.playerId)
	        	var playerId = player._id
	          thisPlayer.playerId = playerId
	          // console.log(thisPlayer.playerId)
	          // console.log(thisPlayer) 
	          // Meteor.call('updateBatLineUpPlayerId', teamId, playerId, i)
	        }
	    } else {
	        console.log("Whoops looks like that player doesnt exist");
	        console.log(i + ". " + name + " isnt in the player directory");
	        var playerId = "Fake PlayerId";
	    }

			// Add player to the player list
			// playerList.push({"battingNumber": i, "playerId": playerId})
		}

		return playerList
	},
	playersInfo: function ( playerId ) {
		var player = Players.findOne({_id: playerId})
		console.log(player)
		return player
	} 
});