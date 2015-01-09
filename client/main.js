//Route to the pages
Router.route('/', function () {
  this.render('Home');
});

Router.route('/admin');

// Display active cards

Meteor.subscribe('activeQuestions');
Meteor.subscribe('userAnswer');

Template.questionCard.helpers({
	'questions': function(){
		return QuestionList.find({active: true});
	}
});

Template.questionCard.events({
	'click .yes': function(){
		event.preventDefault();
		var questionId = this._id;
		var currentUser = Meteor.userId();

		Session.set('answered', questionId);
		var answered = Session.get('answered');

		Meteor.call('questionAnswered', currentUser, answered, true);

	},
	'click .no': function(){
		event.preventDefault();
		var questionId = this._id;
		var currentUser = Meteor.userId();

		Session.set('answered', questionId);
		var answered = Session.get('answered');

		Meteor.call('questionAnswered', currentUser, answered, false);
	}
});