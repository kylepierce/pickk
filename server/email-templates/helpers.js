OriginalHandlebars.registerHelper('firstName', function (name) {
  if (!name) {
    console.log("The username is undefined. Going to call you bud")
    var name = "there"
  }
  return name
});

OriginalHandlebars.registerHelper('upcomingGames', function (name) {
  var specificDay = moment()
  var start = specificDay.startOf('day').add(4, "hour").toDate();
  var selector = {
    scheduled: { $gt: start }, status: "Pre-Game", type: { $ne: "prediction" }, pre_game_processed: { $exists: false }
  };

  var parms = {
    sort: { scheduled: 1 },
    limit: 3,
    fields: { inning: 0, pbp: 0 }
  }

  var games = Games.find(selector, parms);
  console.log(games)
});