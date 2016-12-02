Meteor.publish('dailyPickks', function() {
	this.unblock()
	var userId = this.userId
  return Questions.find({active: true, type: "prediction", usersAnswered: {$nin: [userId]}})  
});

Meteor.publish('predictionGames', function() {
	this.unblock()
	return Games.find({type: "prediction"});
});