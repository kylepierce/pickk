Meteor.publish('activeHero', function() {
  return Hero.find({active: true})  
});