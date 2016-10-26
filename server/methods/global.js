Meteor.methods({
	'thisWeeksDiamonds': function(userId, week){
		check(userId, String);
		check(week, Number);
    this.unblock();

    var startDay = moment().startOf('day').add(4, "hour").day("Tuesday").week(week)._d;
    var endDay = moment().startOf('day').day("Monday").add(28, "hour").week(week+1)._d;

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