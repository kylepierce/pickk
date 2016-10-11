Meteor.methods({
	'thisWeeksDiamonds': function(userId, week){
		check(userId, String);
		check(week, Number);

    var startDay = moment().startOf('day').day("Tuesday").week(week)._d;
    var endDay = moment().startOf('day').add(3, "hour").day("Monday").week(week+1)._d;

    var selector = {
        userId: userId, 
        dateCreated: {
          $gte : startDay, 
          $lt: endDay
        }
      }

    var diamonds = GamePlayed.aggregate(
      { $match: selector }, 
      { $group: {
        _id: null,
        result: { $sum: '$diamonds'}}
      }
    )

    return diamonds
	}
})