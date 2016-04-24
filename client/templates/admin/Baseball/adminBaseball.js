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
	'click [data-action=first]': function(){
		Meteor.call('toggleBase', 'first')
	},
	'click [data-action=second]': function(){
		Meteor.call('toggleBase', "second")
	},
	'click [data-action=third]': function(){
		Meteor.call('toggleBase', 'third')
	}
});

Template.adminBaseball.helpers ({
	atBat: function(){
		var atBat = AtBat.find({ }).fetch()
		return atBat
	},
  strikes: function() {
    var currentAtBat = AtBat.findOne({active: true});
    return currentAtBat.strikeCount
  },
  balls: function() {
    var currentAtBat = AtBat.findOne({active: true});
    return currentAtBat.ballCount
  },
  outs: function ( ) {
    var currentGame = Games.findOne({live: true});
    return currentGame.outs
  },
  first: function () {
    var currentGame = Games.findOne({live: true});
    //  
    var first = currentGame.playersOnBase.first
    if(first){
      return true
    } else {
      return false
    }
  },
  second: function () {
    var currentGame = Games.findOne({live: true});
    // 
    var second = currentGame.playersOnBase.second
    if(second){
      return true
    } else {
      return false
    }
  },
  third: function () {
    var currentGame = Games.findOne({live: true});
    // 
    var third = currentGame.playersOnBase.third
    if(third){
      return true
    } else {
      return false
    }
  },
  inning: function ( ) {
    var currentGame = Games.findOne({live: true});
    // 
    return currentGame.inning
  },
  outs: function() {
    var currentGame = Games.findOne({live: true});
    // 
    var outs = currentGame.outs
    switch(outs){
      case "0" :
        console.log("There are zero outs!")
        return "<img src='/out.png><img src='/out.png><img src='/out.png>"
      break;
      case "1" :
        console.log("There are one outs!")

      break;
      case "2" :
        console.log("There are two outs!")
      break;
      case "3" :
        console.log("There are three outs!")
      break;
    }
  }

});

// Template.battingLineUp.helpers({
// 	batter: function () {
// 		// Find the current game and the team that is at bat.
// 		return Meteor.call("findBattingLineUp")
// 	},
// 	playersInfo: function ( playerId ) {
// 		var player = Players.findOne({_id: playerId})
// 		console.log(player)
// 		return player
// 	} 
// });