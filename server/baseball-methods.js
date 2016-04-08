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
    var currentGame = Games.findOne({live: true})
    var gameId = currentGame._id
    var team = Meteor.call('topOfInning')
    console.log(team)
    console.log(team.teamId)
    var atBatNumber = team.batterNum
    var teamId = team.teamId 
    var teamObj = Teams.findOne({_id: teamId})
    console.log(teamObj)
    var playerId = teamObj.battingOrderLineUp[atBatNumber].playerId
    // var currentAtBat = Players.find({_id: });
    var currentUserId = Meteor.userId();
    var timeCreated = new Date();
    AtBat.insert({
        createdBy: currentUserId,
        dateCreated: timeCreated,
        active: true,
        playerId: playerId,
        gameId: gameId,
        ballCount: 0,
        strikeCount: 0
    });
},

'createBaseballQuestion': function (){
    var timeCreated = new Date();
    var currentUserId = Meteor.userId();
    var currentGame = Games.findOne({live: true});
    
    // Find the Player "At Bat" 
    var currentAtBat = AtBat.findOne({active: true});
    console.log(currentAtBat)
    var strikes = currentAtBat.strikeCount
    console.log(strikes)
    var balls = currentAtBat.ballCount
    console.log(balls)

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
    var question = strikes + " - " + balls;

    QuestionList.insert({
        dateCreated: timeCreated,
        createdBy: currentUserId,
        gameId: currentGame._id,
        active: true,
        commercial: false,
        que: question,
        options: options
    });
},

'increasePitch': function ( ) {    
    // Find out of its the top or bottom of the inning

    // Find the pitcher on visiting (top) or home (bottom) with active equal true

    // Increase the number of pitches by pitcher by 1
},

'addStrike': function(){
    var currentAtBat = AtBat.findOne({active: true});
    AtBat.update(currentAtBat, {$inc: {"strikeCount": 1}});
 },

'addBall': function(){
    var currentAtBat = AtBat.findOne({active: true});
    AtBat.update(currentAtBat, {$inc: {"ballCount": 1}});

 },

 'addWalk': function() {

 },

 'addOut': function(){
    var currentGame = Games.findOne({live: true})    
    Games.update({_id: currentGame._id}, 
            {$inc: {'outs': +1 }})
 },

 'threeOuts': function() {
    var currentGame = Games.findOne({live: true})
    console.log(currentGame.topOfInning)
    var topOfInning = currentGame.topOfInning
    var outs = currentGame.outs
    if(outs == 3) {
        // Toggle the topOfInning
        Games.update({_id: currentGame._id}, 
            {$set: {'topOfInning': !topOfInning }})
    } else {
        console.log("Same team batting")
    }
 },

 'increaseBatterCount': function(){
    var currentGame = Games.findOne({live: true})
    var team = Meteor.call('topOfInningPostion')
    var teamId = currentGame.teams[team].teamId
    var batterNum = currentGame.teams[team].batterNum

    if( batterNum === 9 ) {
        Games.update({live: true, 'teams.teamId': teamId}, {$set: {'teams.$.batterNum': 0}});
        console.log(currentGame.teams[team])
    } else {
        Games.update({live: true, 'teams.teamId': teamId}, {$inc: {'teams.$.batterNum': +1}});
        console.log(currentGame.teams[team])
    }

    
 },

// Add Active Pitcher to Team
'addActivePitcher': function(pitcherId){
    var currentGame = Games.findOne({live: true})
    var team = Meteor.call('topOfInningPostion')
    var teamId = currentGame.teams[team].teamId
    var batterNum = currentGame.teams[team].batterNum

    Games.update({live: true, 'teams.teamId': teamId}, 
        {$push: 
            {'teams.$.pitcher': 
                {playerId: pitcherId, pitchCounter: 0}
            }
        });
    console.log(currentGame.teams[team])

},


// ' multiplierGenerator ': function ( ) {
//   // Find the Game info
//   var currentGame = Games.findOne({live: true});

//   // Team at bat
//   var topOrBottomOfInning = currentGame.inningPosition
//   var teamAtBat = currentGame[topOrBottomOfInning]

//   // Find the batter's info
//   var whoIsAtBat = currentGame.

//   // Find the pitcher info

//   // Find the pitch count  
// }

// "firstName", "lastName", "position", "walks", "strikeout", "secondBase", "thirdBase", "bats", "throws", "avgBat", "homeRun", "rbi", obp, "photo", "injured"


// Add player
'addPlayer': function( teamId,firstName,lastName,position,battingOrderNum,walks,strikeout,secondBase,thirdBase,bats,throws,avgBat,homeRun,rbi,obp,photo,injured ){
    var timeCreated = new Date();
    var currentUserId = Meteor.userId();
    Players.insert({
        createdBy: currentUserId,
        dateCreated: timeCreated,
        teamId: teamId,
        firstName: firstName,
        lastName: lastName, 
        position: position, 
        battingOrderNum: battingOrderNum, 
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
        injured: injured ,
    });
},

// Create A Team to Group Players
'addTeam' : function (fullName, city, state, nickname, players, pitchers, battingOrder){
    Teams.insert({
        fullName : fullName,
        city : city,
        state : state,
        nickname : nickname,
        battingNumber : battingOrder,
        battingOrderLineUp: []
    });
    
},

'topOfInning': function( ) {
    // Find the current game and the team that is at bat.
    var currentGame = Games.findOne({live: true})
    // console.log(currentGame)
    var topOfInning = currentGame.topOfInning
    // console.log(topOfInning)

    // Depending on inning postion pick the visitor (0) or home team (1).
    if( topOfInning === true ){
        console.log("topOfInning is true")
        var team = currentGame.teams[0]
    } else {
        console.log("topOfInning is false")
        var team = currentGame.teams[1]
    }
    return team
},

'topOfInningPostion': function( ) {
    // Find the current game and the team that is at bat.
    var currentGame = Games.findOne({live: true})
    // console.log(currentGame)
    var topOfInning = currentGame.topOfInning
    // console.log(topOfInning)

    // Depending on inning postion pick the visitor (0) or home team (1).
    if( topOfInning === true ){
        console.log("topOfInning is true")
        var team = 0
    } else {
        console.log("topOfInning is false")
        var team = 1
    }
    console.log(team)
    return team
},

'findBattingLineUp' : function ( team ) { 
    console.log(teamPlayers)
    console.log("Team " + team + " players " + teamPlayers)
    return Players.find({teamId: team}).fetch()
},

// What should the system do next?
'nextPlay' : function( value ) {
  switch(value) {
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
    case "Strike Out":
      // Add Pitch increasePitch

      // Change players 
      Meteor.call('increaseBatterCount')

      // Increase Out Counter +1
      Meteor.call('addOut');

      // Check to see the number of outs
      Meteor.call('threeOuts');

      Meteor.call('endBattersAtBat', "Strike Out")

      Meteor.call('createAtBat')

      // Create next question
      Meteor.call('createBaseballQuestion');
      break;
    case "Walk":

      break;
    case "Hit":

      break;
    case "Foul Ball":

      break;
    case "Out":

      break;
  }
},

'addBatterLineUp': function () {
 // Find the current game and the team that is at bat.
 var currentGame = Games.findOne({live: true})
 console.log(currentGame.topOfInning)
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
 for (var i = battingLineUp.length - 1; i >= 0; i--) {
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
'findPlayersId': function(name, position, teamId){
  // We are going to use player's name, position, and teamId
  
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

'endBattersAtBat': function(finalResult){
    AtBat.update({active: true}, {$set:{active: false, result: finalResult}})
},



// moveToNextBase (number)

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