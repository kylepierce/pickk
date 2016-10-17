Meteor.publish('dailyPickks', function() {
	var userId = this.userId
	this.unblock()
  return Questions.find({active: true, type: "prediction", usersAnswered: {$nin: [userId]}})  
});

Meteor.publish('predictionGames', function() {
	this.unblock()
	return Games.find({type: "predictions"});
});