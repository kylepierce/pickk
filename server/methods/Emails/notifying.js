var settings = Meteor.settings.private.mailgunApi
var mg = new Mailgun({ apiKey: settings.apiKey, domain: settings.domain })
var domain = settings.domain

periodName = function (period) {
  switch (period) {
    case 0:
      return "Pre-Game"
      break;
    case 1:
      return period + "st Quarter"
      break;
    case 2:
      return period + "nd Quarter"
      break;
    case 3:
      return period + "rd Quarter"
      break;
    default:
      return period + "th Quarter"
      break;
  }
}

placeGrammer = function (place) {
  switch (place) {
    case 1:
      return place + "st"
      break;
    case 2:
      return place + "nd"
      break;
    case 3:
      return place + "rd"
      break;
    default:
      return place + "th"
      break;
  }
}

sendWinningEmail = function(obj) {
  check(obj, Object);
  var user = UserList.findOne({ _id: obj.userId });
  findEmail = function (user) {
    if (!user.emails && user.services.facebook && !user.services.facebook.email){
      return "??"
    } else if (user.emails) {
      return user.emails[0].address
    } else if (user.services && user.services.facebook) {
      return user.services.facebook.email.address
    } else {
      return "??"
    }
  }

  findPush = function (user) {
    if (user.oneSignalToken) {
      return user.oneSignalToken.userId
    }
  }
  
  var userObject = {
    userId: obj.userId,
    name: user.profile.firstName,
    hasEmail: findEmail(user),
    oneSignal: findPush(user)
  }
  SSR.compileTemplate('awardEmail', Assets.getText('email-templates/prizes.html'));

  var entire = {
    headline: "Winner!",
    preheader: "You Won $" + obj.winningAmount + " playing Pickk!" ,
    firstName: userObject.name,
    copyAbove: "Congrats on winning $" + obj.winningAmount + " ! Below are the prizes and the amounts you won.",
    games: obj.gameObj,
    copyBelow: "You can recieve the prize in form of a Best Buy gift card code emailed to you or by PayPal. Any prize under $10 will be sent by PayPal. Please confirm this is the right PayPal email. Thanks again for playing Pickk!",
    reason: "You received this email because you created an account in the app.",
  }
  var html = SSR.render('awardEmail', entire);
  console.log(userObject.name + " [" + obj.userId + "] $" + obj.winningAmount)
  
  // mg.send({
  //   from: "Kyle at Pickk App<hi@pickk.co>",
  //   // to: "hi+prize@pickk.co",
  //   to: [userObject.hasEmail, "hi+prize@pickk.co"],
  //   subject: "Congratulations on Winning!",
  //   html: html
  // }, function (error, body) {
  //   console.log(body);
  // });
}

Meteor.methods({  
  "notifyWinners": function(){
    // Find all of the winners in the last couple days.
    var lastCoupleDays = moment().subtract(7, 'days')
    var winnings = Winnings.find().fetch();

    // Aggrigate the users and amount
    var allUsers = _.pluck(winnings, 'userId');
    var uniqueUsers = _.uniq(allUsers);

    var winners = _.map(uniqueUsers, function(userId){
      var allWinsByOneUser = _.where(winnings, {userId: userId});
      var amount = 0
      _.each(allWinsByOneUser, function(win){
        amount += win.winnings
      });

      var listOfGames = _.pluck(allWinsByOneUser, 'gameName');
      var uniqueGames = _.uniq(listOfGames);
      // List the quarters won grouped by game.
      var gameObj = _.map(uniqueGames, function (game) {
        var singleGameWins = _.where(allWinsByOneUser, { gameName: game });
        var quartersWon = _.map(singleGameWins, function(quarter){
          var place = placeGrammer(quarter.place)
          var quarterSpelledOut = periodName(quarter.period)
          return "[" + place + " Place] " + quarterSpelledOut + " ($" + quarter.winnings + ")" 
        });

        var obj = {
          name: game,
          quarters: quartersWon
        }
        return obj
      });
      if (userId){
        var user = UserList.findOne({ _id: userId })
        var emailObject = {
          userId: userId, //String
          number: allWinsByOneUser.length, // Number
          userName: user.profile.username,
          winningAmount: amount, // Float
          gameObj: gameObj // Object
        }
        // Send to each person indivually.
        // sendWinningEmail(emailObject);
        return emailObject
      }

    });
    var csv = Papa.unparse(winners);
    return csv
  }
});

// { _id: 'zpgGfgvZTMnRxDqpA',
//   userId: 'F7JnKpLhoCcT8AXeC',
//   dateCreated: Mon Jan 22 2018 21:17:54 GMT-0500 (EST),
//   coins: 66750,
//   gameName: 'Eagles vs Vikings',
//   period: 4,
//   place: 10,
//   winnings: 5,
//   paid: false 
// }