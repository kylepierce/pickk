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
            nonActive: [],

        });
    },

    // A player has an opportunity to bat. This consists of multiple swings.
    'createAtBat': function ( playerId, gameId) {
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
        var active = AtBat.find({active: true}).fetch()
        console.log(active)
        console.log("created at bat")
    },

    'createBaseballQuestion': function (){
        var timeCreated = new Date();
        var currentUserId = Meteor.userId();
        var currentGame = Games.findOne({live: true});
        
        // Find the Player "At Bat" 
        var currentAtBat = AtBat.findOne({active: true});
        var strikes = currentAtBat.strikeCount
        var balls = currentAtBat.ballCount

        // These are the traditional options for single swing.
        var op1 = "Strike";
        var op2 = "Ball";
        var op3 = "Hit";
        var op4 = "Out";

        // If the strike count is at 2 we want to change the "strike" option to "strike out"
        if ( strikes = 2 ) {
            var op1 = "Strike Out";
        }

        // If the ball count is at 3 we want to change the "ball" option to "walk"
        if ( ball = 3 ){
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
            gameId: currentGame,
            active: true,
            commercial: false,
            que: question,
            options: options
        });
    },


// AwardPlayers(Term)
//      Award all the players who correctly guessed the question


'increasePitch': function ( ) {    
    // Find out of its the top or bottom of the inning

    // Find the pitcher on visiting (top) or home (bottom) with active equal true

    // Increase the number of pitches by pitcher by 1
},

// Add Active Pitcher to Team
'addActivePitcher': function(gameId, pitcherId){

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




// // moveToNextBase (number)

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


// batterRotation ()
//      Find what team is batting
//      Batter Number for that team
//      If Batter number does not exist create it and set it equal to zero
//      Check to see if the batting order has been completed and start over at zero
//      Find player from batting order
//      Set the on deck player by finding the batter number plus 1

'addStrike': function(){
    var currentAtBat = AtBat.findOne({active: true});
    AtBat.update(currentAtBat, {$inc: {"strikeCount": 1}});
 },
'addBall': function(){
    var currentAtBat = AtBat.findOne({active: true});
    AtBat.update(currentAtBat, {$inc: {"ballCount": 1}});

 },

// If “Strike” is selected as answer
//      Award players (“Strike”)
//      Increase Strike Counter +1
//      call increasePitch
//      call createQuesitonMethod(strikes, balls)

// If “Ball” is selected as answer
//      Award players (“Strike”)
//      Increase Ball Counter +1
//      call increasePitch
//      call createQuesitonMethod(strikes, balls)

// If “Hit”
//      awardPlayers(“hit”)
//      Prompt admin to select base save that answer to baseNumber
//      call playerToBase ( baseNumber )
//      call increasePitch
//      call createQuesitonMethod(strikes, balls)

// If “Out"
//      awardPlayers("Out")
//      Increase Out Counter by 1

});