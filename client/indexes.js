Meteor.startup(function () {  
  Questions._ensureIndex({userId: 1, gameId: 1, dateCreated: 1})
	GamePlayed._ensureIndex({userId: 1, gameId: 1, dateCreated: 1})
});