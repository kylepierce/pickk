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
	},
  'click [data-action=firstOut]': function(event, template){
    var currentValue = $(event.currentTarget).attr("class");
    Meteor.call('toggleOut', currentValue)
  },
  'click [data-action=secondOut]': function(event, template){
    var currentValue = $(event.currentTarget).attr("class");
    Meteor.call('toggleOut', currentValue)
  },
  'click [data-action=thirdOut]': function(event, template){
    var currentValue = $(event.currentTarget).attr("class");
    Meteor.call('toggleOut', currentValue)
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
  numberOfOuts: function ( ) {
    var currentGame = Games.findOne({live: true});
    console.log(currentGame.outs)
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

Template.adminGameInfo.helpers({
  strikes: function() {
    var currentAtBat = AtBat.findOne({active: true});
    return currentAtBat.strikeCount
  },
  balls: function() {
    var currentAtBat = AtBat.findOne({active: true});
    return currentAtBat.ballCount
  },
  // outs: function ( ) {
  //   var currentGame = Games.findOne({live: true});
  //   return currentGame.outs
  // },
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
    return currentGame.inning
  },
  oneOut: function(){
    var currentGame = Games.findOne({live: true});
    var outs = currentGame.outs
    if ( outs >= 1 ) {
      return true
    }
  },
  twoOuts: function(){
    var currentGame = Games.findOne({live: true});
    var outs = currentGame.outs
    if ( outs >= 2 ) {
      return true
    }
  },
  threeOuts: function(){
    var currentGame = Games.findOne({live: true});
    var outs = currentGame.outs
    if ( outs >= 3 ) {
      return true
    }
  },
})