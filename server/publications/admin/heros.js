Meteor.publish('allHeros', function() {
	this.unblock()
  return Hero.find({})
});
