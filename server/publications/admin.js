Meteor.publish('activeHero', function() {
  return Hero.find({active: true})  
});

Meteor.publish('multiplier', function(){
	return Multipliers.find({})
});