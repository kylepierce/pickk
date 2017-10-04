Meteor.publish('sectionHeros', function(location) {
	check(location, Array);
	this.unblock();
	// dateCreated: {
	// 	$gte : dateStart,
	// 	$lt: dateEnd
	// }
	var selector = {
		location: {$in: location},
		dateStart: {$lt: new Date()},
		dateEnd: {$gt: new Date()}
	}
	var limit = {sort: {important: -1}}
	return Hero.find(selector, limit)
});
