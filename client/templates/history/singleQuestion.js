Template.singleQuestion.helpers({
	status: function () {
		var userId = Meteor.userId();
		var answer = Answers.findOne({"questionId": this.q._id, userId: userId});
		if (this.q.outcome && answer){
			var contains = this.q.outcome.indexOf(answer.answered)
		}

		if (contains > -1) {
			return "history-correct" // Correct
		} else if (answer === undefined && this.q.active === true && this.prePickk === true) {
			return "history-open"
		} else if (this.q.active === true){
			return "history-live" // In progress
		} else if (this.q.active === null){
			return "history-pending" // Pending
		} else {
			return "history-incorrect" // Incorrect
		}
	},
	location: function(){
		var answerExtended = this.extended
		var rounded = this.rounded
		if (answerExtended || rounded) {
			return "single-question-history-card"
		}
	},
	single: function(){
		if(this.single){
			return "hidden"
		}
	}
});

Template.questionTop.helpers({
	questionTitle: function (){
		if(this.q.que.length > 20){
			return "small-question-text";
		}
	},
	timeAgo: function(){
		var userId = Meteor.userId();
		var answer = Answers.findOne({"questionId": this.q._id, userId: userId});
		if(answer){
			var answerCreated = answer.dateCreated
			var now = new Date;
			var diff = now - answerCreated;

			var timeConverter = function(time, length) {
				var timeNumber = time / length;
				return parseFloat(timeNumber).toFixed(0);
			}

			if (diff < 60000) {
				var timeNumber = timeConverter(diff, 1000);
				return timeNumber + " Seconds Ago";
			} else if (diff > 60000 && diff < 3600000) {
				var timeNumber = timeConverter(diff, 60000);
				return timeNumber + " Mins Ago";
			} else if (diff > 3600000 && diff < 86400000) {
				var timeNumber = timeConverter(diff, 3600000);
				return timeNumber + " Hours Ago";
			} else if (diff > 86400000){
				var timeNumber = timeConverter(diff, 86400000);
				return timeNumber + " Days Ago";
			}
		}
	},
	winnings: function (id){
		var userId = Meteor.userId();
		var answer = Answers.findOne({"questionId": this.q._id, userId: userId});

		addCommas = function(number){
			var sign = ""
			if (number > 0){ sign = "+ "}
			return sign + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}

		if (answer){
			if (this.q.outcome) {
				var contains = this.q.outcome.indexOf(answer. answered);
				if (contains > -1) {
					var reward = parseInt(answer.wager * answer.multiplier) // Correct
				} else if (this.q.outcome === "Removed") {
					var reward = answer.wager
				} else {
					var reward = -answer.wager // Incorrect
				}
			} else {
				if (this.q.type === 'freePickk'){
					var reward = answer.wager // Removed
				} else {
					var reward = -answer.wager // Incorrect
				}
			}
			return addCommas(reward)
		} else if (!answer && this.q.active && this.prePickk === true) {
			return "<button class='pre-game-pickks center-text'><i class='icon ion-ios-arrow-right'></i></button>"
		}
	},
});

Template.questionBottom.helpers({
	outcome: function (outcome){
		if (outcome){
			return true;
		}
	},
	answer: function(){
		var userId = Meteor.userId();
		var answer = Answers.findOne({"questionId": this.q._id, userId: userId});
		if (answer){
			return answer.answered;
		}
	},
	notAnswered: function(){
		if (this.q.active){
			return "Not Answered"
		}
	},
	title: function ( option ){
		var options = this.q.options;
		if (option === "Removed" || option === "deleted") {
			return "Removed";
		} else if (Array.isArray(option)) {
			var list = []
			_.map(option, function (o) {
				var selected = options[o];
				list.push(selected.title);
			});

			return list;
		} else if (option === true || option === false) {
			return option;
		}
		var selected = options[option];
		return selected.title;
	},
});

Template.questionExtended.helpers({
	details: function() {
		var userId = Meteor.userId();
		var answerExtended = this.extended;
		var answer = Answers.findOne({"questionId": this.q._id, userId: userId});
		if (answer && answerExtended) {
			return answer;
		}
	}
});

Template.questionDetails.onCreated(function(){
	this.subscribe('questionHistory', this.data.q._id);
	analytics.page('View Single Question Popover', {
		questionId: this.data.q._id
	});
});

Template.questionDetails.helpers({
  'reported': function(){
		var rightNow = moment();
		var days = moment(this.q.dateCreated);
		var timeElapsed = rightNow.diff(days, 'days')
		var questionReported = QuestionReport.findOne({userId: Meteor.userId(), questionId: this.q._id});
		if (questionReported){
			var obj = {
				title: "You Reported This Question",
				report: questionReported
			}
			return obj
		} else if (timeElapsed > 6) {
			var obj = {
				title: "Reporting Closed (Time)"
			}
			return obj
		}
	},
	prettyDate: function(date){
		return moment(date).format("MMM Do YYYY, h:mm a")
	},
	optionTitle: function(optionNumber){
		if (this.report.questionId){
			var question = Questions.findOne({ _id: this.report.questionId });
			var option = question.options[optionNumber]
			if (!option.title){
				return "Deleted"
			} else {
				return option.title
			}
		}
	},
	orginalAnswer: function(){
		if (this.report.questionId) {
			var question = Questions.findOne({ _id: this.report.questionId });
			var correct = question.outcome
			var option = question.options[correct]
			if (!option.title){
				return "No Answer Yet"
			} else {
				return option.title
			}
		}
	}
});

Template.questionDetails.events({
  'click [data-action=report-question]': function(e, t){
		analytics.track('Click Report This Question', {
			questionId: this.q._id,
			userId: Meteor.userId()
		});
    IonModal.open('_reportQuestion', this.q);
  }
});
