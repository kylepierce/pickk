Meteor.methods({
	'thisWeeksDiamonds': function(userId, week){
		check(userId, String);
		check(week, Number);

    var startDay = moment().day("Tuesday").week(week)._d;
    var endDay = moment().day("Monday").week(week+1)._d;

    var selector = {userId: userId, dateCreated: {$gte : startDay, $lt: endDay}}
    var fields = {fields: {_id: 1, diamonds: 1}}
    var games = GamePlayed.find(selector, fields).fetch();

    var sum = 0
    games.forEach(function (game) {
      sum += game.diamonds
    });

    return sum

	}
})