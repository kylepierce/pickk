Meteor.publish('dailyPickks', function() {
	var userId = this.userId
  return Questions.find({active: true, type: "prediction", usersAnswered: {$nin: [userId]}})  
});

Meteor.publish('predictionGames', function() {
	return Games.find({type: "predictions"});
});