Meteor.publish('sectionHeros', function(location) {
	check(location, Array);
	this.unblock()
  return Hero.find({location: {$in: location}});
});
