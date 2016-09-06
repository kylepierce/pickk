Meteor.methods({
	'thisWeeksDiamonds': function(userId, week){
		check(userId, String);
		check(week, Number);
		var diamonds = GamePlayed.aggregate(
      { $match: {userId: userId} }
      ,
      { $group: {
      	_id: {$week: '$dateCreated'},
      	total: {$sum: '$diamonds'}} }
    );
    var obj = diamonds.filter(function ( obj ) {
      console.log(obj, week)
    	return obj._id === week;
		})[0];
		
    return obj.total
	}
})