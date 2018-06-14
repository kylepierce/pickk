Meteor.methods({
  'awardPrizes': function(gameId, period){
    check(gameId, String);
    check(period, Number);

    if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
    }

    if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
    }

    var places = [
      { "place": 1, "winnings": 30 },
      { "place": 2, "winnings": 30 },
      { "place": 3, "winnings": 30 },
      { "place": 4, "winnings": 30 },
      { "place": 5, "winnings": 30 },
      { "place": 6, "winnings": 15 },
      { "place": 7, "winnings": 12 },
      { "place": 8, "winnings": 12 },
      { "place": 9, "winnings": 12 },
      { "place": 10, "winnings": 10 },
      { "place": 11, "winnings": 5 },
      { "place": 12, "winnings": 5 },
      { "place": 13, "winnings": 5 },
      { "place": 14, "winnings": 5 },
      { "place": 15, "winnings": 5 },
      { "place": 16, "winnings": 5 },
      { "place": 17, "winnings": 5 },
      { "place": 18, "winnings": 5 },
      { "place": 19, "winnings": 5 },
      { "place": 20, "winnings": 5 },
      { "place": 21, "winnings": 5 },
      { "place": 22, "winnings": 5 },
      { "place": 23, "winnings": 2 },
      { "place": 24, "winnings": 2 },
      { "place": 25, "winnings": 2 }
    ]

    // Game name
    var gameName = Games.findOne({_id: gameId}).name
    // Find top X in game 
    var winners = GamePlayed.find({ gameId: gameId, period: period, queCounter: { $gt: 0 } }, { fields: { "userId": 1, "coins": 1, "type": 1 }, sort: { coins: -1 }, limit: places.length}).fetch()
    var live = 0
    var drive = 0
    var listOfUsers = _.uniq(_.map(winners, function(user){
      if(user.type === "live"){
        live ++
      } else if(user.type === "drive"){
        drive ++
      }
      return user.userId
    }));

    var data = _.map(places, function(place, index){
      var user = UserList.findOne({ _id: winners[index].userId});
      findEmail = function (user) {
        if (!user){
          return "????"
        } else if (user.emails) {
          return user.emails[0].address
        } else if (user.services.facebook && user.services.facebook.email) {
          return user.services.facebook.email.address
        } else {
          return "??"
        }
      }

      findPush = function (user) {
        if (user.oneSignalToken) {
          return user.oneSignalToken.userId
        } else {
          return false
        }
      }
      var obj = {
        userId: winners[index].userId,
        dateCreated: new Date(),
        // first: user.profile.firstName,
        // last: user.profile.lastName,
        // username: user.profile.username,
        // email: findEmail(user),
        // push: findPush(user),
        coins: winners[index].coins,
        gameName: gameName,
        period: period,
        place: place.place,
        winnings: place.winnings,
        paid: false
      }

      Winnings.insert(obj, function(err, res){
        if(err){
          console.log(err)
        } else {
          console.log(res)
        }
      });
    });
    // var csv = Papa.unparse(data);
    // return csv
  },
});