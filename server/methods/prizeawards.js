var settings = Meteor.settings.private.mailgunApi
var mg = new Mailgun({ apiKey: settings.apiKey, domain: settings.domain })
var domain = settings.domain
var listAddress = "test@" + domain
var list = mg.api.lists(listAddress);

Meteor.methods({
  'emailPrizeWiners': function () {

    var arr = [
      {
        userId: "ScjYEtqj5EQtEof49",
        dollarAmount: 85,
      },
      {
        userId: "2LCjQK3t7mDnikiHE",
        dollarAmount: 60,
      },
      {
        userId: "oK7opoYNLSMDSLuHn",
        dollarAmount: 20,
      },
      {
        userId: "aZZ9YDpqjn5C23iPu",
        dollarAmount: 5,
      },
      {
        userId: "o5SPXt6iK3gw7ndrD",
        dollarAmount: 90,
      },
      {
        userId: "NDR8TrFv5aA8RtESQ",
        dollarAmount: 65,
      },
      {
        userId: "pQxS6SKX2n2SjAdjX",
        dollarAmount: 5,
      },
      {
        userId: "pJcd9xtatHJZEeaCe",
        dollarAmount: 20,
      },
      {
        userId: "morAG7Zx8spTCphrj",
        dollarAmount: 5,
      },
      {
        userId: "F7JnKpLhoCcT8AXeC",
        dollarAmount: 50,
      },
      {
        userId: "PHuQwTLg7vodnn2HT",
        dollarAmount: 80,
      },
      {
        userId: "DdF2pXHw2fh9TQ2Sw",
        dollarAmount: 5,
      },
      {
        userId: "34bNHZFdwjLxTSZW6",
        dollarAmount: 10,
      },
      {
        userId: "Jexi9ySAx6JJD3EL5",
        dollarAmount: 15,
      },
      {
        userId: "AnKhZ5A4k5oDb7mv5",
        dollarAmount: 15,
      },
      {
        userId: "BRpKWNwEcckJ7e7PK",
        dollarAmount: 35,
      },
      {
        userId: "54H3bB5hoPkC6LB4Q",
        dollarAmount: 5,
      },
      {
        userId: "8bhHHRSzqHymYxeqh",
        dollarAmount: 65,
      },
      {
        userId: "ohR7jgHnHhTpS78e5",
        dollarAmount: 10,
      },
      {
        userId: "5pTxTZYTcvT9xLqrj",
        dollarAmount: 35,
      },
      {
        userId: "t8XGdQjhrmM97zbof",
        dollarAmount: 5,
      },
      {
        userId: "B9xrkGmiHL6xsv52N",
        dollarAmount: 10,
      },
      {
        userId: "C9JMbEjvJvDpvXSwj",
        dollarAmount: 5,
      },
      {
        userId: "xbrYdx9B8CkL426C4",
        dollarAmount: 5,
      },
      {
        userId: "pkLHuse4cSeZ7Jyhu",
        dollarAmount: 10,
      },
      {
        userId: "G4w96HRdnxx8dXmZz",
        dollarAmount: 5,
      }
    ]

    var obj = [
      [{title: "Vikings vs Saints", period: ["Quarter 1 - 1st"] }, {title: "Steelers vs Jaguars", period: ["Quarter 1 - 3rd", "Quarter 3 - 1st"] }, {title: "Patriots vs Titans", period: ["Quarter 2 - 4th"] }, {title: "Falcons vs Eagles", period: ["Quarter 2 - 1st"] }],
      [{title: "Vikings vs Saints", period: ["Quarter 1 - 2nd", "Quarter 3 - 1st", "Quarter 4 - 1st"] }],
      [{title: "Vikings vs Saints", period: ["Quarter 1 - 3rd", "Quarter 2 - 4th", "Quarter 3 - 2nd"] }],
      [{title: "Vikings vs Saints", period: ["Quarter 1 - 4th"] }],
      [{title: "Vikings vs Saints", period: ["Quarter 2 - 1st", "Quarter 3 - 3rd"] }, {title: "Steelers vs Jaguars", period: ["Quarter 2 - 1st", "Quarter 3 - 3rd", "Quarter 4 - 1st"] }, {title: "Falcons vs Eagles", period: ["Quarter 2 - 4th"] }],
      [{title: "Vikings vs Saints", period: ["Quarter 2 - 2nd", "Quarter 3 - 4th"] }],
      [{title: "Vikings vs Saints", period: ["Quarter 2 - 3rd"] }],
      [{title: "Vikings vs Saints", period: ["Quarter 4 - 2nd"] }, {title: "Steelers vs Jaguars", period: ["Quarter 2 - 4th"] }, {title: "Falcons vs Eagles", period: ["Quarter 3 - 3rd"] }],
      [{title: "Vikings vs Saints", period: ["Quarter 4 - 3rd"] }],
      [{title: "Vikings vs Saints", period: ["Quarter 4 - 4th"] }, {title: "Steelers vs Jaguars", period: ["Quarter 3 - 4th", "Quarter 4 - 3rd"] }, {title: "Patriots vs Titans", period: ["Quarter 1 - 1st"] }, {title: "Falcons vs Eagles", period: ["Quarter 3 - 2nd"] }],
      [{title: "Steelers vs Jaguars", period: ["Quarter 1 - 2nd", "Quarter 2 - 3rd", "Quarter 3 - 2nd", "Quarter 4 - 2nd"] }, {title: "Patriots vs Titans", period: ["Quarter 4 - 3rd"] }, {title: "Falcons vs Eagles", period: ["Quarter 2 - 2nd", "Quarter 3 - 4th", "Quarter 4 - 1st"] }],
      [{title: "Steelers vs Jaguars", period: ["Quarter 1 - 4th"] }],
      [{title: "Steelers vs Jaguars", period: ["Quarter 2 - 2nd"] }],
      [{title: "Steelers vs Jaguars", period: ["Quarter 4 - 4th"] }, {title: "Falcons vs Eagles", period: ["Quarter 1 - 2nd"] }],
      [{title: "Patriots vs Titans", period: ["Quarter 1 - 2nd"] }, {title: "Falcons vs Eagles", period: ["Quarter 4 - 3rd"] }],
      [{title: "Patriots vs Titans", period: ["Quarter 1 - 3rd", "Quarter 2 - 3rd", "Quarter 4 - 2nd"] }],
      [{title: "Patriots vs Titans", period: ["Quarter 1 - 4th"] }],
      [{title: "Patriots vs Titans", period: ["Quarter 2 - 1st", "Quarter 3 - 2nd"] }, {title: "Falcons vs Eagles", period: ["Quarter 1 - 4th", "Quarter 3 - 1st"] }],
      [{title: "Patriots vs Titans", period: ["Quarter 2 - 2nd"] }],
      [{title: "Patriots vs Titans", period: ["Quarter 3 - 1st", "Quarter 4 - 2nd"] }],
      [{title: "Patriots vs Titans", period: ["Quarter 3 - 3rd"] }],
      [{title: "Patriots vs Titans", period: ["Quarter 3 - 4th", "Quarter 4 - 4th"] }],
      [{title: "Falcons vs Eagles", period: ["Quarter 1 - 3rd"] }],
      [{title: "Falcons vs Eagles", period: ["Quarter 2 - 3rd"] }],
      [{title: "Falcons vs Eagles", period: ["Quarter 4 - 2nd"] }],
      [{title: "Falcons vs Eagles", period: ["Quarter 4 - 4th"] }]
    ]

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
        preheader: "Ahhhh yeahhh! Your winnings are inside",
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