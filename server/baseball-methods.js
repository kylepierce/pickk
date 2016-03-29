// AwardPlayers(Term)
//      Award all the players who correctly guessed the question

// increasePitch ()
//      Increase the number of pitches by pitcher by 1
Meteor.methods({
    'createBaseballGame': function ( team1, team2, dateOfGame, timeOfGame) {
        Games.insert({
            teams: [
              {
                teamId: team1,
                batterNum: 0,
                pitcherId: null
              }, {
                teamId: team2,
                batterNum: 0,
                pitcherId: null
              }
            ],
            date: dateOfGame,
            time: timeOfGame,
            outs: 0,
            inning: 1,
            // Innings are broken into two parts call top and bottom. Top equals 0, bottom equals 1
            inningPosition: 0
        });
    },

    // A player has an opportunity to bat. This consists of multiple swings.
    'createAtBat': function ( playerId, gameId) {
        var currentUserId = Meteor.userId();
        var timeCreated = new Date();
        atBat.insert({
            createdBy: currentUserId,
            dateCreated: timeCreated,
            active: true,
            playerId: playerId,
            gameId: gameId,
            ballCount: 0,
            strikeCount: 0
        });
    },

    'createBaseballQuestion': function (atBatId, strikes, balls, commercial, que){
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
        // if ( ball = 3 ){
        //     o2 = "Walk";
        //     o3 = "Foul Ball";
        //     o4 = "Hit";
        //     o5 = "Out"  
        // }

         // Generate what is likely to happen by calling the multiplier generator

        // Finally we are going to create an option object to give to the database.

        var options = {
            option1: {title: op1, usersPicked: [], multiplier: 2.1 },
            option2: {title: op2, usersPicked: [], multiplier: 2.2 },
            option3: {title: op3, usersPicked: [], multiplier: 2.3 },
            option4: {title: op4, usersPicked: [], multiplier: 2.4 },
        }

        // If option5 exists apend the option to the end of the options object.

        // {
        //     option5: {title: op5, usersPicked: [], multiplier: 2.5 },
        //     option6: {title: op6, usersPicked: [], multiplier: 2.6 },
        // }

        // The Question will be the count
        var question = strikes + " " + balls;

        var timeCreated = new Date();
        var currentUserId = Meteor.userId();
        var currentGame = atBatId.gameId;

        Questions.insert({
            dateCreated: timeCreated,
            createdBy: currentUserId,
            gameId: currentGame,
            active: true,
            commercial: commercial,
            que: question,
            options: options
        });


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