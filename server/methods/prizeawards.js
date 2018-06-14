var settings = Meteor.settings.private.mailgunApi
var mg = new Mailgun({ apiKey: settings.apiKey, domain: settings.domain })
var domain = settings.domain
var listAddress = "test@" + domain
var list = mg.api.lists(listAddress);

Meteor.methods({
  'paidUser': function(userId){
    check(userId, String);
    var userWinnings = Winnings.update({userId: userId}, {$set: {paid: true}}, {multi: true})
  },
  'emailPrizeWiners': function () {

    for (var index = 0; index < arr.length; index++) {
      arr[index].gameObj = obj[index];
    }

    _.each(arr, function (player) {
      findEmail = function (user) {
        if (user.emails) {
          return user.emails[0].address
        } else if (user.services && user.services.facebook.email) {
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

      expandGames = function(listOfGames){
        return _.map(listOfGames, function(item){
          var title = item.title
          var periods = _.map(item.period, function(period){
            return period
          });
          return title + "\n" + periods.join(", ") + "\n\n"
        });
      }

      // Get each users info based on their userId
      var user = UserList.findOne({ _id: player.userId })

      // Each item
      var entire = {
        headline: "Congrats!!",
        preheader: "Ahhhh yeahhh! Super Bowl winnings are inside!",
        copyAbove: "Congrats on winning",
        prize: expandGames(player.gameObj),
        dollars: player.dollarAmount,
        copyBelow: "Do you want me to mail it or just provide you the code(s)? \nLet me know! Thanks again for playing Pickk! \n\nCheers,\nPickk Team\n\nP.S. It would mean a lot to us if you left a review on the app store. It would help other sports fans find the app and make us feel proud.",
        reason: "You received this email because you created an account in the app.",
      }

      
      var userObject = {
        name: user.profile.firstName,
        hasEmail: findEmail(user),
        oneSignal: findPush(user)
      }

      var text = userObject.name + ",\n\n" + entire.copyAbove + " a $" + entire.dollars + " Best Buy Gift Card! \n\n" + entire.prize + entire.copyBelow
      var internal = userObject.name + "$" + entire.dollars
      console.log(internal)

      // mg.send({
      //   from: "Kyle at Pickk App<hi@pickk.co>",
      //   to: [userObject.hasEmail, "hi+prize@pickk.co"],
      //   subject: "Winner!",
      //   text: text,
      //   // html: html
      // }, function (error, body) {
      //   if(error){
      //     console.log(userObject)
      //   }
      // });
      // console.log("Sent email to ", userObject.name, player.userId, userObject.hasEmail)
    })
  }
});