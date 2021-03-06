Template.adminBaseball.events({
	'click [data-action=createBaseballQuestion]': function (event, template) {
		event.preventDefault();
		Meteor.call('createBaseballQuestion');
	}, 
	'click [data-action=createAtBat]': function (event, template) {
		event.preventDefault();
    var currentGame = Games.findOne({ _id: "591e3d2fe47ced8845054bab"});
	  var currentGameId = currentGame._id
		Meteor.call('createAtBat', "playerId", currentGameId);
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
    var currentGame = Games.findOne({_id: "591e3d2fe47ced8845054bab"});
    return currentGame.outs
  },
  first: function () {
    var currentGame = Games.findOne({_id: "591e3d2fe47ced8845054bab"});
    //  
    var first = currentGame.playersOnBase.first
    if(first){
      return true
    } else {
      return false
    }
  },
  second: function () {
    var currentGame = Games.findOne({_id: "591e3d2fe47ced8845054bab"});
    // 
    var second = currentGame.playersOnBase.second
    if(second){
      return true
    } else {
      return false
    }
  },
  third: function () {
    var currentGame = Games.findOne({_id: "591e3d2fe47ced8845054bab"});
    // 
    var third = currentGame.playersOnBase.third
    if(third){
      return true
    } else {
      return false
    }
  },
  inning: function ( ) {
    var currentGame = Games.findOne({_id: "591e3d2fe47ced8845054bab"});
    // 
    return currentGame.inning
  },
  outs: function() {
    var currentGame = Games.findOne({_id: "591e3d2fe47ced8845054bab"});
    // 
    var outs = currentGame.outs
    switch(outs){
      case "0" :
        console.log("There are zero outs!")
        return "<img src='/out.png><img src='/out.png><img src='/out.png>"
      break;
      case "1" :
      break;
      case "2" :
      break;
      case "3" :

      break;
    }
  }

});

Template.adminGameInfo.events({
  'submit #count': function (event, template) {
    event.preventDefault()
    var ballNumber = template.find('.ball-number').value
    var strikeNumber = template.find('.strike-number').value
    var playerAtBat = AtBat.findOne({active: true})

    var ballNumber = parseInt(ballNumber)
    var strikeNumber = parseInt(strikeNumber)

    Meteor.call('updateCount', playerAtBat, ballNumber, strikeNumber)
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
  first: function () {
    var currentGame = Games.findOne({_id: "591e3d2fe47ced8845054bab"});
    //  
    var first = currentGame.playersOnBase.first
    if(first){
      return true
    } else {
      return false
    }
  },
  second: function () {
    var currentGame = Games.findOne({_id: "591e3d2fe47ced8845054bab"});
    // 
    var second = currentGame.playersOnBase.second
    if(second){
      return true
    } else {
      return false
    }
  },
  third: function () {
    var currentGame = Games.findOne({_id: "591e3d2fe47ced8845054bab"});
    // 
    var third = currentGame.playersOnBase.third
    if(third){
      return true
    } else {
      return false
    }
  },
  inning: function ( ) {
    var currentGame = Games.findOne({_id: "591e3d2fe47ced8845054bab"});
    return currentGame.inning
  },
  oneOut: function(){
    var currentGame = Games.findOne({_id: "591e3d2fe47ced8845054bab"});
    var outs = currentGame.outs
    if ( outs >= 1 ) {
      return true
    }
  },
  twoOuts: function(){
    var currentGame = Games.findOne({_id: "591e3d2fe47ced8845054bab"});
    var outs = currentGame.outs
    if ( outs >= 2 ) {
      return true
    }
  },
  threeOuts: function(){
    var currentGame = Games.findOne({_id: "591e3d2fe47ced8845054bab"});
    var outs = currentGame.outs
    if ( outs >= 3 ) {
      return true
    }
  },
})

Template.atBats.helpers({
  atBat: function () {
    return AtBat.find({active: true}).fetch();
  },
  onePlayer: function ( id ) {
    var player = Players.findOne({_id: id});
    return player
  },
});

Template.atBats.events({
  'click [data-action=endAtBat]': function(){
    if(confirm("Are you sure?")) {
      var moveOn = confirm('Do you want to move on to next player?')
      if( moveOn == true ) {
        Meteor.call('increaseBatterCount')
        Meteor.call('createAtBat') 
      }
      Meteor.call('updateAtBat', "Deleted")
      Meteor.call('endBattersAtBat', "Deleted")
    }
  }
})
