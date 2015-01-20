
Meteor.methods({
	'insertQuestion' : function(que, game){

		// Variables to make the calling easy

		var currentUserId = Meteor.userId();
		var timeCreated = new Date();

		// Insert the question into the database
		QuestionList.insert({
			que: que,
			dateCreated: timeCreated,
			game: game,
			createdBy: currentUserId,
			active: true,
	   		usersTrue: [],
	   		usersFalse: []
		});
	},
	'modifyQuestionStatus' : function(questionId, answer){
		QuestionList.update(questionId, {$set: {active: false, answer: answer}});

		var usersTrue = _.pluck( QuestionList.find({"_id": questionId}).fetch(), 'usersTrue' );
		var usersFalse = _.pluck( QuestionList.find({"_id": questionId}).fetch(), 'usersFalse' );
		if (answer === true) {
			usersTrue.map(function (user) {
				console.log("These users get 100 coins " + user);
				for (var i = user.length - 1; i >= 0; i--) {
					user = user[i]
					wager =  _.pluck( Meteor.users.find({_id:user}).fetch(), questionId.wager);
					console.log(wager)
					Meteor.users.update( {_id: user}, {$inc: { "profile.coins": wager}} );
				};
				
			});
			usersFalse.map(function (user) {
				console.log("These users lose 100 coins " + user);
				for (var i = user.length - 1; i >= 0; i--) {
					Meteor.users.update( {_id: user[i]}, {$inc: { "profile.coins": -100}} );
				};
			});
		} else {
			usersFalse.map(function (user) {
				console.log("These users get 100 coins " + user);
				for (var i = user.length - 1; i >= 0; i--) {
					Meteor.users.update( {_id: user[i]}, {$inc: { "profile.coins": 100}} );
				};
				
			});
			usersTrue.map(function (user) {
				console.log("These users lose 100 coins " + user);
				for (var i = user.length - 1; i >= 0; i--) {
					Meteor.users.update( {_id: user[i]}, {$inc: { "profile.coins": -100}} );
				};
			});
		}
	},

	'deactivateStatus' : function(questionId){
		QuestionList.update(questionId, {$set: {active: null}});
	},

	'questionAnswered' : function( user, questionId, answer, wager){
		Meteor.users.update( { _id: user}, {$push: {questionAnswered: { questionId: questionId, 
			wager: wager, answered: answer}}});
		if (answer === true){
			QuestionList.update(questionId, {$push: {usersTrue: user}});
		} else {
			QuestionList.update(questionId, {$push: {usersFalse: user}});
		};
	}
});