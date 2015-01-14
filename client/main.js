//Route to the pages
Router.route('/', function () {
  this.render('Home');
});

Router.route('/dashboard', function () {
  this.render('Home');
});

Router.route('/admin');

// Display active cards

Meteor.subscribe('activeQuestions');
Meteor.subscribe('userAnswer');

Template.questionCard.helpers({
	'questions': function(){
		var currentUser = Meteor.userId();
		return QuestionList.find({active: true, usersTrue: {$nin: [currentUser]}, 
		usersFalse: {$nin: [currentUser]}});
	}
});

Template.questionCard.events({
	'click [data-action=answerYes]': function(){
		event.preventDefault();
		var questionId = this._id;
		var currentUser = Meteor.userId();

		Session.set('answered', questionId);
		var answered = Session.get('answered');
		console.log(currentUser + " Answered Yes to question " + questionId);

		Meteor.call('questionAnswered', currentUser, answered, true);

	},
	'click [data-action=answerNo]': function(){
		event.preventDefault();
		var questionId = this._id;
		var currentUser = Meteor.userId();

		Session.set('answered', questionId);
		var answered = Session.get('answered');

		Meteor.call('questionAnswered', currentUser, answered, false);
	}
});