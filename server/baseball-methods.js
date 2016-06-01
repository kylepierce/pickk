Meteor.methods({
'createBaseballGame': function ( team1, team2, title, active, tvStation, dateOfGame, timeOfGame ) {
    function findTeamId (teamName) {
      var team = Teams.findOne({fullName: teamName})
      return team._id
    };

    var team1 = findTeamId(team1)
    var team2 = findTeamId(team2)

    var currentUserId = Meteor.userId();
    var timeCreated = new Date();
    Games.insert({
        dateCreated: timeCreated,
        createdBy: currentUserId,
        name: title,
        gameDate: dateOfGame,
        time: timeOfGame,
        tv: tvStation,
        live: false,
        commercial: false,
        completed: false,
        teams: [
          {
            teamId: team1,
            batterNum: 0,
            pitcher: [],
            battingLineUp: []
          }, {
            teamId: team2,
            batterNum: 0,
            pitcher: [],
            battingLineUp: []
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
  var battingLineUp = currentGame.teams[team].battingLineUp
  var playerId = battingLineUp[atBatNumber]
  // var teamObj = Teams.findOne({_id: teamId})

  // var playerId = teamObj.battingOrderLineUp[atBatNumber].playerId
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

  // Find players name
  var player = Players.findOne({_id: playerId})
  var playerName = player.name

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

  var options = Meteor.call('playMultiplierGenerator', playerId, options)

  var question = "End of " + playerName + "'s at bat." ;

  QuestionList.insert({
    dateCreated: timeCreated,
    createdBy: currentUserId,
    playerId: playerId,
    atBatQuestion: true,
    gameId: currentGame._id,
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

  // Find players name
  var playerName = Players.findOne({_id: playerId}).name

  // These are the traditional options for single swing.
  var op1 = "Strike";
  var op2 = "Ball";
  var op3 = "Hit";
  var op4 = "Out";

  // If the strike count is at 2 we want to change the "strike" option to "strike out"

  // If the ball count is at 3 we want to change the "ball" option to "walk"
  if ( balls === 3 ){
      var op2 = "Walk";
      var op3 = "Hit";
      var op4 = "Out"  
  }

  if ( strikes === 2 ) {
      var op1 = "Strike Out";
      var op3 = "Foul Ball";
      var op4 = "Hit";
      var op5 = "Out"  
  }

  // Finally we are going to create an option object to give to the database.
  var options = {
      option1: { title: op1, usersPicked: [], multiplier: 1.45 },
      option2: { title: op2, usersPicked: [], multiplier: 1.65 },
      option3: { title: op3, usersPicked: [], multiplier: 7.35 },
      option4: { title: op4, usersPicked: [], multiplier: 3.23 },
  }

  // If "op5" exists add the option to the end of the options object.
  if( op5 ){
      options.option5 = { title: op5, usersPicked: [], multiplier: 1 }
  }

  // Generate what is likely to happen by calling the multiplier generator
  var options = Meteor.call('multiplierGenerator', playerId, strikes, balls, options)

  // The Question will be the count
  var question =  playerName + ": " + balls + " - " + strikes ;

  QuestionList.insert({
      dateCreated: timeCreated,
      createdBy: currentUserId,
      gameId: currentGame._id,
      playerId: playerId,
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
  var numberOfBatters = currentGame.teams[team].battingLineUp.length
  var numberOfBatters = numberOfBatters - 1
  var team = Teams.findOne({_id: teamId})
  

  if( batterNum === numberOfBatters ) {
      Games.update({live: true, 'teams.teamId': teamId}, {$set: {'teams.$.batterNum': 0}});
  } else {
      Games.update({live: true, 'teams.teamId': teamId}, {$inc: {'teams.$.batterNum': +1}});
  }
},

'changeBatterNumber': function (teamId, batterNumber){
  var batterNumber = parseInt(batterNumber)
  Games.update({live: true, 'teams.teamId': teamId}, {$set: {'teams.$.batterNum': batterNumber}});
},

'updateCount': function ( atBat, ball, strike ) {
  AtBat.update(atBat, {$set: {ballCount: ball, strikeCount: strike}});
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

'multiplierGenerator': function ( batter, strikes, balls, options ) {
  // Find the batter's info
  var playerAtBat = Players.findOne({_id: batter})
  var currentGame = Games.findOne({live: true})

  // Total at bat
  if (!playerAtBat.stats.three_year.no_statistics_available_){
    var totalAtBat = playerAtBat.stats.three_year.total.ab
  } else {
    var totalAtBat = playerAtBat.stats.y2016extended.total.ab
  }

  // What options are available? 
  var count = "count_" + balls + "_" + strikes
  if (!playerAtBat.stats.three_year.no_statistics_available_){
    var thisPlay = playerAtBat.stats.three_year[count]
    if (!thisPlay) {
      console.log("There is no data available")
      var thisPlay = playerAtBat.stats.career
    }
  } else {
    var thisPlay = playerAtBat.stats.y2016extended[count]
    if (!thisPlay) {
      var thisPlay = {
        "ab": "8",
        "r": "2",
        "h": "3",
        "double": "0",
        "triple": "0",
        "hr": "1",
        "rbi": "2",
        "bb": "0",
        "hbp": "0",
        "so": "0",
        "sb": "0",
        "cs": "0",
        "avg": ".375",
        "obp": ".375",
        "slg": ".750"
      }
      console.log("There is no data available")
    }
  }
  var thisPlayEoP = thisPlay.ab

  // End of Play probability 
  var EoP = parseInt(thisPlayEoP) / parseInt(totalAtBat)
  var remainingPercent = 1 - EoP
  var hitPercent = thisPlay.avg * EoP
  var outPercent = ( 1 - hitPercent ) * EoP

  // Option 1 add strike
  if( strikes == 2 ){
    var option1EoP = thisPlay.so
  } else {
    var strike = strikes + 1 
    var count = "count_" + balls + "_" + strike
    if (!playerAtBat.stats.three_year.no_statistics_available_){
      var nextPlay = playerAtBat.stats.three_year[count]
    }
    else {
      var nextPlay = playerAtBat.stats.y2016extended[count]
    }
    if(nextPlay){
      var option1EoP = nextPlay.ab
    } else {
      var option1EoP = 1
      console.log("These if statements are getting out of hand.")
    }
  }

  // Option 2 add ball
  if ( balls == 3 ){
    var option2EoP = thisPlay.bb
  } else {
    var ball = balls + 1 
    var count = "count_" + ball + "_" + strikes
    if (!playerAtBat.stats.three_year.no_statistics_available_){
      var nextPlay = playerAtBat.stats.three_year[count]
    }
    else {
      var nextPlay = playerAtBat.stats.y2016extended[count]
    }
    if(nextPlay){
      var option2EoP = nextPlay.ab
    } else {
      var option2EoP = 1
      console.log("These if statements are getting out of hand.")
    }
  }

  var option1EoP = parseInt(option1EoP);
  var option2EoP = parseInt(option2EoP);
  var combinedEoP = option1EoP + option2EoP
  var option1EoPPercentage = (( option1EoP / combinedEoP ) * remainingPercent).toFixed(4)
  var option2EoPPercentage = (( option2EoP / combinedEoP ) * remainingPercent).toFixed(4)

  var strikePercent = (100- (option1EoPPercentage *100).toFixed(2))
  var ballPercent = (100- (option2EoPPercentage *100).toFixed(2))
  var outPercent = (100- (outPercent*100).toFixed(2))
  var hitPercent = (100- (hitPercent*100).toFixed(2))

  function getRandomArbitrary(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
  }

  function toMultiplier ( number ) {
    var number = parseInt(number)
    switch (true){
      case (number < 25):
        var number = getRandomArbitrary(1.15,1.25)
        return number
        break;
      case (number < 50):
        var number = getRandomArbitrary(1.25, 1.5)
        return number
        break;
      case (number < 60):
        var number = getRandomArbitrary(1.5,1.75)
        return number
        break;
      case (number < 75):
        var number = getRandomArbitrary(1.75, 2.25)
        return number
        break;
      case (number < 85):
        var number = getRandomArbitrary(2.25, 2.75)
        return number
        break;
      case (number < 90):
        var number = getRandomArbitrary(2.75, 3.5)
        return number
        break;
      case (number < 1000):
        var number = getRandomArbitrary(3.5, 4.5)
        return number
        break;
      default:
        console.log(number + " doesnt work?")
        var number = getRandomArbitrary(1.25, 1.5)
        return number
        break;
    } 
  }

  if(strikes < 2 && balls < 3) {
    options.option1.multiplier = toMultiplier(strikePercent) 
    options.option2.multiplier = toMultiplier(ballPercent) 
    options.option3.multiplier = toMultiplier(outPercent) 
    options.option4.multiplier = toMultiplier(hitPercent) 
  } else if ( strikes === 2 && balls === 3 ) {
    options.option1.multiplier = toMultiplier(strikePercent) 
    options.option2.multiplier = toMultiplier(ballPercent) 
    options.option3.multiplier = getRandomArbitrary(1.5, 2) 
    options.option4.multiplier = toMultiplier(hitPercent) 
    options.option5.multiplier = toMultiplier(outPercent) 
  } else if (strikes === 2 ) {
    options.option1.multiplier = toMultiplier(strikePercent) 
    options.option2.multiplier = toMultiplier(ballPercent) 
    options.option3.multiplier = getRandomArbitrary(1.5, 2) 
    options.option4.multiplier = toMultiplier(hitPercent) 
    options.option5.multiplier = toMultiplier(outPercent) 
  } else if (balls === 3) {
    options.option1.multiplier = toMultiplier(strikePercent) 
    options.option2.multiplier = toMultiplier(ballPercent) 
    options.option3.multiplier = toMultiplier(hitPercent) 
    options.option4.multiplier = toMultiplier(outPercent) 
  }
  return options 
},

'playMultiplierGenerator': function (batter, options) {
  // Find the batter's info
  var playerAtBat = Players.findOne({_id: batter})
  var currentGame = Games.findOne({live: true})

  // Total at bat
  if (!playerAtBat.stats.three_year.no_statistics_available_){
    var totalAtBat = playerAtBat.stats.three_year.total.ab
  } else {
    var thisPlay = playerAtBat.stats.y2016extended.total.ab
  }

  // Are there players on base?
  var playersOnBase = currentGame.playersOnBase

  if (!playerAtBat.stats.three_year.no_statistics_available_){
    var stat = playerAtBat.stats.three_year
  }
  else {
    var stat = playerAtBat.stats.y2016extended
  }

  if(playersOnBase.first == true && playersOnBase.second == true && playersOnBase.third == true) {
    var situationStats = stat.bases_loaded
  } else if (playersOnBase.first == true ){
    var situationStats = stat.runners_on
  } else if (playersOnBase.second == true || playersOnBase.third == true) {
    var situationStats = stat.scoring_position
  } else if (stat.total) {
    var situationStats = stat.total
    console.log("Thsi does exist")
  } else {
    var situationStats = playerAtBat.stats.y2016extended
    console.log("Maybe career")
  }

  function getRandomArbitrary(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
  }

  function atleastOne (number) {
    if(number < 1) {
      return 1
    }
  }

  function toMultiplier ( number ) {
    var number = parseInt(number)
    switch (true){
      case (number < 25):
        var number = getRandomArbitrary(1,1.75)
        return number
        break;
      case (number < 50):
        var number = getRandomArbitrary(1.5, 2)
        return number
        break;
      case (number < 60):
        var number = getRandomArbitrary(2,2.5)
        return number
        break;
      case (number < 75):
        var number = getRandomArbitrary(2.25, 2.75)
        return number
        break;
      case (number < 85):
        var number = getRandomArbitrary(2.5, 3)
        return number
        break;
      case (number < 90):
        var number = getRandomArbitrary(3, 3.5)
        return number
        break;
      case (number < 95):
        var number = getRandomArbitrary(3.5, 3.75)
        return number
        break;
      case (number < 99):
        var number = getRandomArbitrary(3.75, 4.5)
        return number
        break;
      case (number < 1000):
        var number = getRandomArbitrary(4.5, 5)
        return number
        break;
      default:
        console.log(number + " doesnt work?")
        break;
    } 
  }

  if(situationStats){
    var atBats = situationStats.ab
    var avg = situationStats.avg
    var hit = situationStats.h
    var walk = parseInt(situationStats.bb)
    // Going to break here for players without three year stats.
    var hitByBall = parseInt(situationStats.hbp)
    var walkPercent = (walk + hitByBall ) / atBats
    var homeRun = parseInt(situationStats.hr)
    var homeRunPercent = homeRun / atBats
    var triple = parseInt(situationStats.triple)
    var triplePercent = triple / atBats
    var double = parseInt(situationStats.double)
    var doublePercent = double / atBats
    var single = parseInt(hit - homeRun - double - triple)
    var singlePercent = single / atBats
    var outs = (atBats - hitByBall - walk - homeRun - triple - double - single)
    var outPercent = outs / atBats
  } else {
    var atBats = situationStats.ab
    var avg = situationStats.avg
    var hit = situationStats.h
    var walk = parseInt(situationStats.bb)
    var hitByBall = parseInt(situationStats.hbp)
    var walkPercent = (walk + hitByBall ) / atBats
    var homeRun = parseInt(situationStats.hr)
    var homeRunPercent = homeRun / atBats
    var triple = parseInt(situationStats.triple)
    var triplePercent = triple / atBats
    var double = parseInt(situationStats.double)
    var doublePercent = double / atBats
    var single = parseInt(hit - homeRun - double - triple)
    var singlePercent = single / atBats
    var outs = (atBats - hitByBall - walk - homeRun - triple - double - single)
    var outPercent = outs / atBats
  }

  var outPercent = (100 - (outPercent*100).toFixed(2))
  var walkPercent = (100 - (walkPercent*100).toFixed(2))
  var singlePercent = (100 - (singlePercent*100).toFixed(2))
  var doublePercent = (100 - (doublePercent*100).toFixed(2))
  var triplePercent = (100 - (triplePercent*100).toFixed(2))
  var homeRunPercent = (100 - (homeRunPercent*100).toFixed(2))

  options.option1.multiplier = toMultiplier(outPercent) 
  options.option2.multiplier = toMultiplier(walkPercent) 
  options.option3.multiplier = toMultiplier(singlePercent) 
  options.option4.multiplier = toMultiplier(doublePercent) 
  options.option5.multiplier = toMultiplier(triplePercent)
  options.option6.multiplier = toMultiplier(homeRunPercent)
  
  return options
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
  var topOfInning = currentGame.topOfInning

  // Depending on inning postion pick the visitor (0) or home team (1).
  if( topOfInning === true ){
      var team = currentGame.teams[0]
  } else {
      var team = currentGame.teams[1]
  }

  return team
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

'findTeamAtBatLineup': function(){
  var teamId = Meteor.call('topOfInning');
  var findBattingLineUp = Meteor.call('findBattingLineUp', teamId);
  return findBattingLineUp
},

'findBattingLineUp' : function ( team ) { 
  var team = Teams.findOne({_id: team})
  var battingOrderLineUp = team.battingOrderLineUp
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

'toggleBase': function ( number ) {
  var currentGame = Games.findOne({live: true})
  var playersOnBase = currentGame.playersOnBase
  switch ( number ) {  
    case "third":
      var baseValue = currentGame.playersOnBase.third 
      Games.update({"_id": currentGame._id}, {$set: { "playersOnBase.third": !baseValue}});
      break;
    case "second":
      var baseValue = currentGame.playersOnBase.second
      Games.update({"_id": currentGame._id}, {$set: { "playersOnBase.second": !baseValue}});
      break;
    case "first":
      var baseValue = currentGame.playersOnBase.first
      Games.update({"_id": currentGame._id}, {$set: { "playersOnBase.first": !baseValue}});
      break;
    }
},

'toggleOut': function (active ) {
  var currentGame = Games.findOne({live: true})
  console.log(active)
  if (active == "admin-out") {
    var outs = currentGame.outs
    if(outs == 0){
      return 
    } else {
      Games.update({_id: currentGame._id}, {$inc: { "outs": -1}});
    }
  } else {
    var outs = currentGame.outs
    if(outs == 2){
       console.log("inning is over!")
    } else {
      Games.update({_id: currentGame._id}, {$inc: { "outs": 1}});
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

'addPlayerToLineup': function ( gameId, teamId, playerId ) {
  Games.update({_id: gameId, 'teams.teamId': teamId}, {$push: {"teams.$.battingLineUp": playerId}})
},

'removePlayerFromLineup': function ( gameId, teamId, playerId ) {
  Games.update({_id: gameId, 'teams.teamId': teamId}, {$pull: {"teams.$.battingLineUp": playerId}})
},

'changeBattingPostion': function( gameId, teamId, playerId, indexPosition, upOrDown ) {
  var game = Games.find({_id: gameId, 'teams.teamId': teamId}, {fields: {"teams.$.battingLineUp": 1}}).fetch()
  var newPosition = indexPosition + parseInt(upOrDown)
  Games.update({_id: gameId, 'teams.teamId': teamId}, {$pull: {"teams.$.battingLineUp": playerId}})
  Games.update({_id: gameId, 'teams.teamId': teamId}, {$push: {"teams.$.battingLineUp": { $each: [playerId], $position: newPosition}}})
},

'playersPlaying': function (){
  var currentGame =Games.findOne({live: true})
  var team1 = currentGame.teams[0].battingLineUp
  var team2 = currentGame.teams[1].battingLineUp
  var teams = team1.concat(team2)
  return teams
},

'teamPlaying': function (){
  var currentGame =Games.findOne({live: true})
  var team1 = currentGame.teams[0].teamId
  var team2 = currentGame.teams[1].teamId
  var teams = [team1, team2]
  return teams
}


});