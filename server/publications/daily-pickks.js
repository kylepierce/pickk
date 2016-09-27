Meteor.publish('dailyPickks', function() {
  return Questions.find({type: "prediction", active: true})  
});

Meteor.publish('predictionGames', function() {
	return Games.find({type: "predictions"});
});