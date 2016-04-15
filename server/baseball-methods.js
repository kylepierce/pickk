Meteor.methods({
'createBaseballGame': function ( team1, team2, dateOfGame, timeOfGame, tvStation ) {
    var currentUserId = Meteor.userId();
    var timeCreated = new Date();
    Games.insert({
        dateCreated: timeCreated,
        createdBy: currentUserId,
        date: dateOfGame,
        time: timeOfGame,
        tv: tvStation,
        live: false,
        commercial: false,
        completed: false,
        teams: [
          {
            teamId: team1,
            batterNum: 0,
            pitcher: []
          }, {
            teamId: team2,
            batterNum: 0,
            pitcher: []
          }
        ],
        outs: 0,
        inning: 1,
        topOfInning: true,
        playersOnBase: {
            first: false,
            second: false,
            third: false
        },
        users: [],
        nonActive: []
    });
}, 

// A player has an opportunity to bat. This consists of multiple swings.
'createAtBat': function () {
  var currentUserId = Meteor.userId();
  var timeCreated = new Date();

  var currentGame = Games.findOne({live: true})
  var gameId = currentGame._id

  var team = Meteor.call('topOfInningPostion')
  var teamId = currentGame.teams[team].teamId
  var atBatNumber = currentGame.teams[team].batterNum
  var teamObj = Teams.findOne({_id: teamId})

  var playerId = teamObj.battingOrderLineUp[atBatNumber].playerId
  // var pitcher = Meteor.call('findActivePitcher');
  // pitcherId = pitcher.playerId

  AtBat.insert({
    createdBy: currentUserId,
    dateCreated: timeCreated,
    active: true,
    playerId: playerId,
    // pitcherId: pitcherId,
    gameId: gameId,
    ballCount: 0,
    strikeCount: 0
  });

  Meteor.call('createAnAtBatQuestion')
  Meteor.call('createBaseballQuestion')

},

'createAnAtBatQuestion': function() {
  var timeCreated = new Date();
  var currentUserId = Meteor.userId();
  var currentGame = Games.findOne({live: true});
  
  // Find the Player "At Bat" 
  var currentAtBat = AtBat.findOne({active: true});
  var playerId = currentAtBat.playerId
  var pitcherId = currentAtBat.pitcherId

  var op1 = "Out";
  var op2 = "Walk";
  var op3 = "Single";
  var op4 = "Double";
  var op5 = "Triple";
  var op6 = "Home Run";

  var options = {
    option1: {title: op1, usersPicked: [], multiplier: 2.1 },
    option2: {title: op2, usersPicked: [], multiplier: 2.2 },
    option3: {title: op3, usersPicked: [], multiplier: 2.3 },
    option4: {title: op4, usersPicked: [], multiplier: 2.4 },
    option5: {title: op5, usersPicked: [], multiplier: 2.3 },
    option6: {title: op6, usersPicked: [], multiplier: 2.4 },
  }

  var question = "End of " + currentAtBat.playerId + " at bat." ;

  QuestionList.insert({
    dateCreated: timeCreated,
    createdBy: currentUserId,
    atBatQuestion: true,
    // gameId: currentGame._id,
    active: true,
    commercial: false,
    que: question,
    options: options
  });
},

'createBaseballQuestion': function (){
  var timeCreated = new Date();
  var currentUserId = Meteor.userId();
  var currentGame = Games.findOne({live: true});
  
  // Find the Player "At Bat" 
  var currentAtBat = AtBat.findOne({active: true});
  var strikes = currentAtBat.strikeCount
  var balls = currentAtBat.ballCount
  var playerId = currentAtBat.playerId
  var pitcherId = currentAtBat.pitcherId

  // These are the traditional options for single swing.
  var op1 = "Strike";
  var op2 = "Ball";
  var op3 = "Hit";
  var op4 = "Out";

  // If the strike count is at 2 we want to change the "strike" option to "strike out"
  if ( strikes === 2 ) {
      var op1 = "Strike Out";
  }

  // If the ball count is at 3 we want to change the "ball" option to "walk"
  if ( balls === 3 ){
      var op2 = "Walk";
      var op3 = "Foul Ball";
      var op4 = "Hit";
      var op5 = "Out"  
  }

  // Generate what is likely to happen by calling the multiplier generator
  // Meteor.call('', playerId, pitcherId, strikes, balls)


  // Finally we are going to create an option object to give to the database.
  var options = {
      option1: {title: op1, usersPicked: [], multiplier: 2.1 },
      option2: {title: op2, usersPicked: [], multiplier: 2.2 },
      option3: {title: op3, usersPicked: [], multiplier: 2.3 },
      option4: {title: op4, usersPicked: [], multiplier: 2.4 },
  }

  // If "op5" exists add the option to the end of the options object.
  if( op5 ){
      options.option5 = {title: op5, usersPicked: [], multiplier: 2.5 }
  }

  // The Question will be the count
  var question =  balls + " - " + strikes ;

  QuestionList.insert({
      dateCreated: timeCreated,
      createdBy: currentUserId,
      // gameId: currentGame._id,
      active: true,
      commercial: false,
      que: question,
      options: options
  });
},

'addStrike': function(){
    var currentAtBat = AtBat.findOne({active: true});
    AtBat.update(currentAtBat, {$inc: {"strikeCount": 1}});
 },

'addBall': function(){
    var currentAtBat = AtBat.findOne({active: true});
    AtBat.update(currentAtBat, {$inc: {"ballCount": 1}});

 },

'addOut': function(){
  var currentGame = Games.findOne({live: true})    
  Games.update({_id: currentGame._id}, {$inc: {'outs': +1 }})
},

'threeOuts': function() {
  var currentGame = Games.findOne({live: true})
  var topOfInning = currentGame.topOfInning
  var inning = currentGame.inning
  var outs = currentGame.outs
  if(outs == 3) {
      // Check to see if its the bottom of the inning and less than 9th inning
      if((topOfInning == false) && (inning < 9)  ){
        Games.update({_id: currentGame._id}, {$inc: {'inning': +1}})
      }
      // Toggle the topOfInning
      Games.update({_id: currentGame._id}, {$set: {'outs': 0, 'topOfInning': !topOfInning, "playersOnBase.second": false, "playersOnBase.first": false, "playersOnBase.third": false}})
  }
},

'increaseBatterCount': function(){
  var currentGame = Games.findOne({live: true})
  var team = Meteor.call('topOfInningPostion')
  var batterNum = currentGame.teams[team].batterNum
  var teamId = currentGame.teams[team].teamId
  var team = Teams.findOne({_id: teamId})
  var numberOfBatters = team.battingOrderLineUp.length
  var numberOfBatters = numberOfBatters - 1

  if( batterNum === numberOfBatters ) {
      Games.update({live: true, 'teams.teamId': teamId}, {$set: {'teams.$.batterNum': 0}});
  } else {
      Games.update({live: true, 'teams.teamId': teamId}, {$inc: {'teams.$.batterNum': +1}});
  }

  
},

// Add Active Pitcher to Team
'addActivePitcher': function(pitcherId){
  var currentGame = Games.findOne({live: true})
  var team = Meteor.call('topOfInningPostion')
  var teamId = currentGame.teams[team].teamId

  Games.update({live: true, 'teams.teamId': teamId}, 
      {$push: 
          {'teams.$.pitcher': 
              {playerId: pitcherId, pitchCounter: 0, active: true}
          }
      });
},

'findActivePitcher': function( ) {
  var currentGame = Games.findOne({live: true})
  var team = Meteor.call('topOfInningPostion')
  var teamId = currentGame.teams[team].teamId

  var pitcher = currentGame.teams[team].pitcher.filter(function( obj ){
    return obj.active == true;
  })

  return pitcher[0]

},

'increasePitch': function ( ) {   
  var currentGame = Games.findOne({live: true})
  var team = Meteor.call('topOfInningPostion')
  var teamId = currentGame.teams[team].teamId

  var pitcher = Meteor.call('findActivePitcher')

  var pitcherId = pitcher[0].playerId

  // Games.update({live: true, 'teams.teamId': teamId}, {$inc: {'teams.$.pitcher.pitchCounter': +1}});

  // ,  'teams.team.pitcher.active': true

  var pitcherObj = Games.findOne({'live': true, 'teams.team.pitcher.playerId': pitcherId})
  // Games.update({live: true, 'teams.team.pitcher.playerId': pitcherId, 'teams.team.pitcher.active': true}, 
  //   {$set: 
  //       {'teams.team.pitcher.$.pitchCounter':  +1 }
  //   });


    // Increase the number of pitches by pitcher by 1
},

' multiplierGenerator ': function ( batter, pitcher, strikes, balls ) {
  // Find the batter's info
  var playerAtBat = Players.findOne({_id: batter})
  var pitcher = Players.findOne({_id: pitcher})

  var currentGame = Games.findOne({live: true})



  // Find the pitcher info

  // Find the pitch count  
},

// Add player
'addPlayer': function( teamId, firstName, lastName, position, walks, strikeout, secondBase, thirdBase, bats, throws, avgBat, homeRun, rbi, obp, photo, injured ){
  var timeCreated = new Date();
  var currentUserId = Meteor.userId();
  Players.insert({
    createdBy: currentUserId,
    dateCreated: timeCreated,
    teamId: teamId,
    firstName: firstName,
    lastName: lastName, 
    position: position, 
    stats: {
        secondBase: secondBase,
        thirdBase: thirdBase, 
        walks: walks,
        bats: bats,
        throws: throws,
        avgBat: avgBat,
        homeRun: homeRun,
        rbi: rbi,
        obp: obp,
     },
    photo: photo ,  
    injured: injured 
  });
},

// Create A Team to Group Players
'addTeam' : function (fullName, city, state, nickname){
  Teams.insert({
    fullName : fullName,
    city : city,
    state : state,
    nickname : nickname,
    battingOrderLineUp: []
  });    
},

'topOfInning': function( ) {
  // Find the current game and the team that is at bat.
  var currentGame = Games.findOne({live: true})
  console.log("game info " + currentGame)
  var topOfInning = currentGame.topOfInning
  console.log("Team Info " + topOfInning)

  // Depending on inning postion pick the visitor (0) or home team (1).
  if( topOfInning === true ){
      var team = currentGame.teams[0]
  } else {
      var team = currentGame.teams[1]
  }
  console.log("team Id " + team.teamId)
  return team.teamId
},

'topOfInningPostion': function( ) {
  // Find the current game and the team that is at bat.
  var currentGame = Games.findOne({live: true})

  var topOfInning = currentGame.topOfInning

  // Depending on inning postion pick the visitor (0) or home team (1).
  if( topOfInning === true ){
      var team = 0
  } else {
      var team = 1
  }
  return team
},

'addBattingLineup': function ( teamId, n0, p0, n1, p1, n2, p2, n3, p3, n4, p4, n5, p5, n6, p6, n7, p7, n8, p8, n9, p10 ) {
  var battingOrderLineUp = []
  var args = arguments
  for ( var i = 1; i < args.length-1 ; i+=2 ) {
    var name = args[i]
    var position = args[i+1] 
    var batter = { "name": name, "position": position }
    battingOrderLineUp.push(batter) 
  }
  Teams.update({_id: teamId}, {$set: {"battingOrderLineUp": battingOrderLineUp}});
},

'findTeamAtBatLineup': function(){
  var teamId = Meteor.call('topOfInning');
  console.log(teamId)
  var findBattingLineUp = Meteor.call('findBattingLineUp', teamId);
  return findBattingLineUp
},

'findBattingLineUp' : function ( team ) { 
  console.log(team)
  var team = Teams.findOne({_id: team})
  console.log( team )
  var battingOrderLineUp = team.battingOrderLineUp
  console.log( battingOrderLineUp )
  return battingOrderLineUp
},



// What should the system do next?
'nextPlay' : function( value , baseNumber, optionNumber ) {
  switch( value ) {
    case "Strike":
      // Increase Strike Counter
      Meteor.call('addStrike');

      // Add Pitch increasePitch
      
      // Create next question
      Meteor.call('createBaseballQuestion');
      break;

    case "Ball": 
      // Increase Ball Counter +1
      Meteor.call('addBall');

      // Add Pitch increasePitch

      // Create next question
      Meteor.call('createBaseballQuestion');
      break;

    case "Foul Ball":
      // Add Pitch increasePitch

      // Create next question
      Meteor.call('createBaseballQuestion');
      break;

    case "Strike Out":
      // Add Pitch increasePitch

      // Change players 
      Meteor.call('increaseBatterCount')

      // Increase Out Counter +1
      Meteor.call('addOut');

      // Check to see the number of outs
      Meteor.call('threeOuts');

      Meteor.call('endBattersAtBat', "Strike Out")
      Meteor.call('updateAtBat', "option1")

      Meteor.call('createAtBat')
      break;

    case "Walk":
      // Add Pitch increasePitch

      // Change players 
      Meteor.call('increaseBatterCount')

      // Move this player to first base
      Meteor.call('sendToABase', 1)

      Meteor.call('endBattersAtBat', "Walk")
      Meteor.call('updateAtBat', "option2")

      Meteor.call('createAtBat')
      break;

    case "Hit":
      // Add Pitch increasePitch

      // Change players 
      Meteor.call('increaseBatterCount')

      // Find what base they got to
      Meteor.call('sendToABase', baseNumber)

      var message = "Base " + baseNumber
      var updatedOptionNumber = parseInt( baseNumber) + 2
      var option = "option" + updatedOptionNumber
      if(baseNumber === 4){
        var option = "option6"
      }
      Meteor.call('endBattersAtBat', message)
      Meteor.call('updateAtBat', option)

      Meteor.call('createAtBat')

      break;

    case "Out":
      // Add Pitch increasePitch

      // Change players 
      Meteor.call('increaseBatterCount')

      // Increase Out Counter +1
      Meteor.call('addOut');

      // Check to see the number of outs
      Meteor.call('threeOuts');

      Meteor.call('endBattersAtBat', "Out")
      Meteor.call('updateAtBat', "option1")

      Meteor.call('createAtBat')

      break;
  }
},

'addBatterLineUp': function () {
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
 var teamId = team.teamId
 var team = Teams.findOne({_id: teamId})

 // Then Find the batting line up
 var battingLineUp = team.battingOrderLineUp

 // Store all of the players on a list 
 var playerList = []

 //For every name on the batter line up. Find the player id.
 for ( var i = battingLineUp.length - 1; i >= 0; i-- ) {
  // Get the player
  var thisPlayer = battingLineUp[i]

  // Name and position
  var name = thisPlayer.name
  var position = thisPlayer.position

  var playerId = Meteor.call('findPlayersId', name, position, teamId);

  
  selector = {};
  operator = {};
  selector['battingOrderLineUp.' + i + '.playerId'] = playerId; 
  operator['$set'] = selector;  

   // Add player to the player list
  Teams.update({'_id': teamId}, operator);
 }
},

//Find a players id
'findPlayersId': function( name, position, teamId ){
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
          var playerId = player._id
      }
  } else {
      console.log( name + " isnt in the player directory");
      var playerId = "Fake PlayerId";
  }

  return playerId
},

'endBattersAtBat': function( finalResult ){
    AtBat.update({active: true}, {$set:{active: false, result: finalResult}})

    // Award people who correctly guessed the at bat

},


'updateAtBat': function( optionNumber ){
  var currentAtBatQuestion = QuestionList.findOne({atBatQuestion: true, active: null})
  var questionId = currentAtBatQuestion._id

  Meteor.call('modifyQuestionStatus', questionId, optionNumber)
},


'checkIfPlayerIsOn': function ( number ){
  // Check to see if a player if on that base
  var currentGame = Games.findOne({live: true})
  var playersOnBase = currentGame.playersOnBase
  var number = parseInt(number)
  switch ( number ) {
    case 4: 
      
      return false
      break;
    case 3: 

      return playersOnBase.third
      break;
    case 2:

      return playersOnBase.second
      break;
    case 1:

      return playersOnBase.first
      break;
  }
},

'moveToNextBase': function( number ) {
  if (number > 4 || number < 1) {
    console.log('there are only 4 bases to move to');
    return 
  }
  var isThereAPlayer = Meteor.call('checkIfPlayerIsOn', number)
  var number = parseInt(number)
  var currentGame = Games.findOne({live: true})
  var playersOnBase = currentGame.playersOnBase
  if( isThereAPlayer ){
    console.log("Whoa! There is someone already here!")
    if(number < 2){
      Meteor.call('checkIfPlayerIsOn', number+1)
    } else if (number == 3){
      // increase this teams score by one
      console.log('Someones gonna score!')
    }
    
  } else {
    console.log('Congrats you are now the owner of ' + number + " base")
    switch ( number ) {
      case 4: 
        Games.update({"_id": currentGame._id}, {$set: { "playersOnBase.second": false, "playersOnBase.first": false, "playersOnBase.third": false}});
        break;
      case 3: 
        Games.update({"_id": currentGame._id}, {$set: { "playersOnBase.second": false, "playersOnBase.first": false, "playersOnBase.third": true}});
        break;
      case 2:
        Games.update({"_id": currentGame._id}, {$set: {"playersOnBase.second": true, "playersOnBase.first": false}})
        break;
      case 1:
        Games.update({"_id": currentGame._id}, {$set: {"playersOnBase.first": true}})
        break;
    }
  }
},

'sendToABase': function( number ){
  if (number > 4 || number < 1) {
    console.log('there are only 4 bases to move to');
    return 
  }
  // var isThereAPlayer = Meteor.call('checkIfPlayerIsOn', number)
  var number = parseInt(number)
  var currentGame = Games.findOne({live: true})
  var playersOnBase = currentGame.playersOnBase
  switch ( number ) {
    case 4: 
      Games.update({"_id": currentGame._id}, {$set: { "playersOnBase.second": false, "playersOnBase.first": false, "playersOnBase.third": false}});
      
      break;    
    case 3: 
      
      Games.update({"_id": currentGame._id}, {$set: { "playersOnBase.second": false, "playersOnBase.first": false, "playersOnBase.third": true}});
      
      break;
    case 2:
      
      Games.update({"_id": currentGame._id}, {$set: {"playersOnBase.second": true, "playersOnBase.first": false}})
      break;
    case 1:
      
      Games.update({"_id": currentGame._id}, {$set: {"playersOnBase.first": true}})
      break;
  }
},



// ' playerToBase ': function ( number ){
//   var g = Games.findOne({live: true});

//  // check that the number is equal to or less than 4

//   if (number = 4) {
  
//     Games.update({ "_id": g._id }, { $set: g.base[0]: false, g.base[1]: false, g.base[2]: false } )
  
//   } else if (number = 3) {
  
//     Games.update({ "_id": g._id }, { $set: g.base[0]: false, g.base[1]: false, g.base[2]: true } )
  
//   } else if (number = 2) {
    
//   } else if (number = 1){
//     var playerOnFirst = g.base[0]
//     console.log(playerOnSecond)
//     if ( playerOnSecond === true) {
//           Games.update({ "_id": g._id }, { $set: g.base[0]: true, g.base[1]: true, g.base[2]: true } )
//       } else {
//           Games.update({ "_id": g._id }, { $set: g.base[0]: false, g.base[1]: true, g.base[2]: false } )
//       }
//   }
//  else {
//      set playerOnFirst to true
//  }
// }
});