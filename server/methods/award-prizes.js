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
      { "place": 2, "winnings": 20},
      { "place": 3, "winnings": 10},
      { "place": 4, "winnings": 10},
      { "place": 5, "winnings": 10},
      { "place": 6, "winnings": 5},
      { "place": 7, "winnings": 5},
      { "place": 8, "winnings": 5},
      { "place": 9, "winnings": 5},
      { "place": 10, "winnings": 5},
      { "place": 11, "winnings": 2.50},
      { "place": 12, "winnings": 2.50},
      { "place": 13, "winnings": 2.50},
      { "place": 14, "winnings": 2.50},
      { "place": 15, "winnings": 0},
      { "place": 16, "winnings": 0},
      { "place": 17, "winnings": 0}
    ]

    // Game name
    var gameName = Games.findOne({_id: gameId}).name
    // Find top X in game
    var winners = GamePlayed.find({ gameId: gameId, period: period, queCounter: {$gt: 0}}, { fields: { "userId": 1, "coins": 1 }, sort: { coins: -1 }, limit: places.length}).fetch()

    _.each(places, function(place, index){
      var obj = {
        userId: winners[index].userId,
        dateCreated: new Date(),
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
  },
});