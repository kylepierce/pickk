Template.singleQuestion.helpers({
	status: function () {
		var userId = Meteor.userId();
		var answer = Answers.findOne({"questionId": this.q._id, userId: userId});
		if (this.q.outcome && answer){
			var contains = this.q.outcome.indexOf(answer.answered)
		}

		if (contains > -1) {
			return "history-correct" // Correct
		} else if (answer === undefined && this.q.active === true) {
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
			return "Make a Pickk!"
		} else {
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
});

Template.questionDetails.helpers({
  'reported': function(){
		var questionReported = QuestionReport.findOne({gameId: this.q.gameId, userId: Meteor.userId(), questionId: this.q._id});
    if (questionReported){
      return true;
    }
  }
});

Template.questionDetails.events({
  'click [data-action=report-question]': function(e, t){
    IonModal.open('_reportQuestion', this.question);
  }
});
