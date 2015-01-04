//Route to the pages
Router.route('/', function () {
  this.render('Home');
});

Router.route('/admin');

// Display active cards

Template.questionCard.helpers({
	'questions': function(){
		return QuestionList.find({active: true })
	}
});

Template.questionCard.events({
	'click .yes': function(event){
		var questionId = this._id;
		var currentUser = Meteor.userId();

		Session.set('answerQuestion', questionId);
		Session.set('userClick', currentUser);

		var answeredYes = Session.get('answerQuestion');
		var userClick = Session.get('userClick');

		QuestionList.update(answeredYes, {$push: {usersTrue: currentUser}});
		Meteor.userId().update(userClick, {$push: {questionsAnswered: questionId}});

	},
	'click .no': function(event){
		event.preventDefault();
		var questionId = this._id;
		var currentUser = Meteor.userId();

		Session.set('answerNo', questionId);

		var answeredNo = Session.get('answerNo');

		QuestionList.update(answeredNo, {$push: {usersFalse: currentUser}})
	}
});

// Create question and add to database function

Template.createQuestion.events({
	'submit form': function(event){
		// Single page app so turn off reload
		event.preventDefault();

		// Variables to make the calling easy
		var que = event.target.newQuestion.value;
		var teamOne = event.target.teamOne.value;
		var teamTwo = event.target.teamTwo.value;

		// Insert the question into the database
		QuestionList.insert({
			que: que,
			teams: [teamOne, teamTwo],
			active: true,
     		usersTrue: [],
     		usersFalse: [],
		});

		// Reset form for single page app
		$("#question")[0].reset()
	}
});

// Show all active questions

Template.activeQuestionList.helpers({
	'questions': function(){
		return QuestionList.find({active: true});
	}
});

// Show all old questions

Template.oldQuestionList.helpers({
	'questions': function(){
		return QuestionList.find({active: false});
	}
});

// Answer queestions to make them true or false after they happen

Template.activeQuestionList.events({
	'click .yes': function() {

		// Select the id of the yes button that is clicked
		var questionId = this._id;
		Session.set('clickedYes', questionId);
		
		// Get the session
		var clickedYes = Session.get('clickedYes');

		// Update the database without losing any data
		QuestionList.update(clickedYes, {$set: {active: false, answer: true}})
		
	},
	'click .no': function() {

		// Select the id of the no button that is clicked
		var questionId = this._id;
		Session.set('clickedNo', questionId);

		// Get the session
		var clickedNo = Session.get('clickedNo');

		// Update the database without losing any data
		QuestionList.update(clickedNo, {$set: {active: false, answer: false}})
	}

});
