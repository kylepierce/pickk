Template.singleGameHistory.rendered = function() {
    console.log(this.data); // you should see your passage object in the console
};

Template.singleAnswer.helpers({
	answer: function (id) {
		return Answers.findOne({"questionId": id})
	},
	active: function (status){
		if(status === true){
			return 'meow'
		}
	}
});


// Template.singleGameHistory.onCreated(function() {
//   this.subscribe('userData');
//   this.subscribe('game', this.data._id);
//   this.subscribe('questionsByGameId', this.data._id);
//   this.subscribe('answersByGameId', this.data._id);
//   this.autorun(function(computation) {
//     if (Template.instance().subscriptionsReady()) {
//       $(".loader").delay(100).fadeOut('fast', function() {
//         $(".loading-wrapper").fadeIn('fast');
//       });
//       computation.stop()
//     }
//   })
// });

// Template.singleGameHistory.onRendered(function() {
//   $("svg").delay(0).fadeIn();
// });

// Template.singleGameHistory.helpers({
//   game: function() {
//     return Games.findOne(this._id);
//   },
//   active: function() {
//     var active = this.active
//     if (active == true || active == null) {
//       return true
//     }
//   },
//   date: function() {
//     return moment(this.dateCreated).format("MMMM D [at] HH:mm");
//   },
//   answerIs: function(play) {
//     switch (play) {
//       case "option1":
//         return this.options.option1.title;
//         break;
//       case "option2":
//         return this.options.option2.title;
//         break;
//       case "option3":
//         return this.options.option3.title;
//         break;
//       case "option4":
//         return this.options.option4.title;
//         break;
//       case "option5":
//         return this.options.option5.title;
//         break;
//       case "option6":
//         return this.options.option6.title;
//         break;
//       case "deleted":
//         return "deleted";
//         break;
//     }
//   },
//   answeredQuestions: function() {
//     var answers = Answers.find({gameId: this._id}).fetch();
//     var answeredQuestionIds = _.pluck(answers, "questionId");
//     return Questions.find({_id: {$in: answeredQuestionIds}}, {sort: {dateCreated: -1}});
//   },
//   userAnswer: function(questionFromTemplate_id, play, questionFromTemplate) {
//     var answer = Answers.findOne({questionId: questionFromTemplate_id});
//     var wager, binaryChoice;
//     var commercial = questionFromTemplate.commercial
//     if (answer.wager === undefined) {
//       wager = 500
//     } else {
//       wager = answer.wager
//     }
//     if (questionFromTemplate.binaryChoice === undefined) {
//       binaryChoice = true
//     } else {
//       binaryChoice = false
//     }
//     var active = questionFromTemplate.active
//     var winningObj = {
//       "active": active,
//       "wager": wager,
//       "winnings": 0,
//       "answered": answer.answered,
//       "commercial": commercial,
//       "binaryChoice": binaryChoice,
//       "correctAnswer": play
//     }

//     switch (answer.answered) {
//       case "option1":
//         if (play === "option1") {
//           if (questionFromTemplate.options.option1.multiplier === undefined) {
//             winningObj.multiplier = 4
//           } else {
//             winningObj.multiplier = parseFloat(questionFromTemplate.options.option1.multiplier)
//           }
//           winningObj.winnings = parseInt(winningObj.wager * winningObj.multiplier)
//           winningObj.description = this.options.option1.title
//           winningObj.correct = true
//           return winningObj;
//         } else if (play === "deleted") {
//           winningObj.multiplier = 0
//           winningObj.correct = false
//           winningObj.winnings = parseInt(winningObj.wager)
//           return winningObj;
//         } else {
//           winningObj.description = this.options.option1.title
//           winningObj.multiplier = 0
//           winningObj.correct = false
//           winningObj.winnings = parseInt(winningObj.wager * winningObj.multiplier)
//           return winningObj;
//         }
//         break;

//       case "option2":
//         if (play === "option2") {
//           if (questionFromTemplate.options.option2.multiplier === undefined) {
//             winningObj.multiplier = 4
//           } else {
//             winningObj.multiplier = parseFloat(questionFromTemplate.options.option2.multiplier)
//           }
//           winningObj.winnings = parseInt(winningObj.wager * winningObj.multiplier)
//           winningObj.description = this.options.option2.title
//           winningObj.correct = true
//           return winningObj;
//         } else if (play === "deleted") {
//           winningObj.multiplier = 0
//           winningObj.correct = false
//           winningObj.winnings = parseInt(winningObj.wager)
//           return winningObj;
//         } else {
//           winningObj.description = this.options.option2.title
//           winningObj.multiplier = 0
//           winningObj.correct = false
//           winningObj.winnings = parseInt(winningObj.wager * winningObj.multiplier)
//           return winningObj;
//         }
//         break;

//       case "option3":
//         if (play === "option3") {
//           if (questionFromTemplate.options.option3.multiplier === undefined) {
//             winningObj.multiplier = 4
//           } else {
//             winningObj.multiplier = parseFloat(questionFromTemplate.options.option3.multiplier)
//           }
//           winningObj.winnings = parseInt(winningObj.wager * winningObj.multiplier)
//           winningObj.description = this.options.option3.title
//           winningObj.correct = true
//           return winningObj;
//         } else if (play === "deleted") {
//           winningObj.multiplier = 0
//           winningObj.correct = false
//           winningObj.winnings = parseInt(winningObj.wager)
//           return winningObj;
//         } else {
//           winningObj.description = this.options.option3.title
//           winningObj.multiplier = 0
//           winningObj.correct = false
//           winningObj.winnings = parseInt(winningObj.wager * winningObj.multiplier)
//           return winningObj;
//         }
//         break;

//       case "option4":
//         if (play === "option4") {
//           if (questionFromTemplate.options.option4.multiplier === undefined) {
//             winningObj.multiplier = 4
//           } else {
//             winningObj.multiplier = parseFloat(questionFromTemplate.options.option4.multiplier)
//           }
//           winningObj.winnings = parseInt(winningObj.wager * winningObj.multiplier)
//           winningObj.description = this.options.option4.title
//           winningObj.correct = true
//           return winningObj;
//         } else if (play === "deleted") {
//           winningObj.multiplier = 0
//           winningObj.correct = false
//           winningObj.winnings = parseInt(winningObj.wager)
//           return winningObj;
//         } else {
//           winningObj.description = this.options.option4.title
//           winningObj.multiplier = 0
//           winningObj.correct = false
//           winningObj.winnings = parseInt(winningObj.wager * winningObj.multiplier)
//           return winningObj;
//         }
//         break;

//       case "option5":
//         if (play === "option5") {

//           if (questionFromTemplate.options.option5.multiplier === undefined) {
//             winningObj.multiplier = 4
//           } else {
//             winningObj.multiplier = parseFloat(questionFromTemplate.options.option5.multiplier)
//           }
//           winningObj.winnings = parseInt(winningObj.wager * winningObj.multiplier)
//           winningObj.description = this.options.option5.title
//           winningObj.correct = true
//           return winningObj;
//         } else if (play === "deleted") {
//           winningObj.multiplier = 0
//           winningObj.correct = false
//           winningObj.winnings = parseInt(winningObj.wager)
//           return winningObj;
//         } else {
//           winningObj.description = this.options.option5.title
//           winningObj.multiplier = 0
//           winningObj.correct = false
//           winningObj.winnings = parseInt(winningObj.wager * winningObj.multiplier)
//           return winningObj;
//         }
//         break;

//       case "option6":
//         if (play === "option6") {
//           if (questionFromTemplate.options.option6.multiplier === undefined) {
//             winningObj.multiplier = 4
//           } else {
//             winningObj.multiplier = parseFloat(questionFromTemplate.options.option6.multiplier)
//           }
//           winningObj.winnings = parseInt(winningObj.wager * winningObj.multiplier)
//           winningObj.description = this.options.option6.title
//           winningObj.correct = true
//           return winningObj;
//         } else if (play === "deleted") {
//           winningObj.multiplier = 0
//           winningObj.correct = false
//           winningObj.winnings = parseInt(winningObj.wager)
//           return winningObj;
//         } else {
//           winningObj.description = this.options.option6.title
//           winningObj.multiplier = 0
//           winningObj.correct = false
//           winningObj.winnings = parseInt(winningObj.wager * winningObj.multiplier)
//           return winningObj;
//         }
//         break;
//     }
//   }
// });


