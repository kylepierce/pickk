Template.singleGameHistory.onCreated( function() {
	this.subscribe('userData');
	this.subscribe('game', this.data._id);
	this.subscribe('questionsByGameId', this.data._id);
	this.subscribe('answersByGameId', this.data._id);
	this.autorun(function(computation) {
		if (Template.instance().subscriptionsReady()) {
			$( ".loader" ).delay( 100 ).fadeOut( 'fast', function() {
				$( ".loading-wrapper" ).fadeIn( 'fast' );
			});
			computation.stop()
		}
	})
});

Template.singleGameHistory.onRendered( function() {
	$( "svg" ).delay( 0 ).fadeIn();
});

Template.singleGameHistory.helpers({
	game: function(){
		return Games.findOne(this._id);
	},
	active: function(){
		var active = this.active
		if(active == true || active == null){
			return true
		}
	},
	date: function(){
		var monthArray = ["January","February","March","April","May","June","July","August","September","October","November","December",
		]
		function twelveHours(i) {
	    if (i < 10) {
	        i = "0" + i;
	    } else if (i > 12) {
	    	i -= 12
	    	i = "0" + i
	    }
	    return i;
		}

		function addZero(i){
			if (i < 10) {
	      i = "0" + i;
	    }
	    return i
		}

		function addOne(i){
			i += 1
			return i
		}

		var date = this.dateCreated
		// var hour = date.getHours();
  //   var min = date.getMinutes();
  	var month = monthArray[date.getMonth()];
  	var day = addOne(date.getDay());
		var hour = twelveHours(date.getHours());
    var min = addZero(date.getMinutes());
    // return date.toDateString();
		return month + " " + day + " at " + hour + ":" + min;
	},
	answerIs:function(play){
		switch (play){
			case "option1":
				return this.options.option1.title;
				break;
			case "option2":
				return this.options.option2.title;
				break;
			case "option3":
				return this.options.option3.title;
				break;
			case "option4":
				return this.options.option4.title;
				break;
			case "option5":
				return this.options.option5.title;
				break;
			case "option6":
				return this.options.option6.title;
				break;
			case "deleted":
				return "deleted";
				break;
		} 
	},
	question: function () {
		var userId = Meteor.userId();
		var questionsAnswered = QuestionList.find({"usersAnswered": {$in: [userId]} }, {sort: {dateCreated: -1}}).fetch()
		return questionsAnswered
	},
	userAnswer: function(questionFromTemplate_id, play, questionFromTemplate){
		var answers = Answers.find({questionId: questionFromTemplate_id}).fetch();
		console.log(answers);
		var questionIds = _.pluck(answers, "questionId")
		var spot = _.indexOf(questionIds, questionFromTemplate_id)
		var questionId = questionIds[spot]
		var answer = answers[spot]
		var userAnswered = answer.answered
		var wager = answer.wager
		var commercial = questionFromTemplate.commercial
		if(answer.wager === undefined){
			var wager = 500
		} else {
			var binaryChoice = answer.wager
		}
		if(questionFromTemplate.binaryChoice === undefined){
			var binaryChoice = true
		} else {
			var binaryChoice = false
		}
		var active = questionFromTemplate.active
		var playName = this.options.option1.title
		var winningObj = {
				"active": active,
				"wager": wager,
				"winnings": 0,
				"answered": userAnswered,
				"commercial": commercial,
				"binaryChoice": binaryChoice,
				"correctAnswer": play
			}

		switch (userAnswered){
			case "option1":
				if(play === "option1"){

					if(questionFromTemplate.options.option1.multiplier === undefined){
						winningObj.multiplier = 4
					} else {
						winningObj.multiplier = parseFloat(questionFromTemplate.options.option1.multiplier)
					}

					winningObj.winnings = parseInt(winningObj.wager * winningObj.multiplier )
					winningObj.description = this.options.option1.title
					winningObj.correct = true
					return winningObj;
				} else if (play === "deleted") {
					winningObj.multiplier = 0
					winningObj.correct = false
					winningObj.winnings = parseInt(winningObj.wager)
					return winningObj;
				}  else {
					winningObj.description = this.options.option1.title
					winningObj.multiplier = 0
					winningObj.correct = false
					winningObj.winnings = parseInt(winningObj.wager * winningObj.multiplier )
					return winningObj;
				}

				break;

			case "option2":
				if(play === "option2"){
					
					if(questionFromTemplate.options.option2.multiplier === undefined){
						winningObj.multiplier = 4
					} else {
						winningObj.multiplier = parseFloat(questionFromTemplate.options.option2.multiplier)
					}
					winningObj.winnings = parseInt(winningObj.wager * winningObj.multiplier )
					winningObj.description = this.options.option2.title
					winningObj.correct = true
					return winningObj;
				} else if (play === "deleted") {
					winningObj.multiplier = 0
					winningObj.correct = false
					winningObj.winnings = parseInt(winningObj.wager)
					return winningObj;
				} else {
					winningObj.description = this.options.option2.title
					winningObj.multiplier = 0
					winningObj.correct = false
					winningObj.winnings = parseInt(winningObj.wager * winningObj.multiplier )
					return winningObj;
				}
				break;
			case "option3":
				if(play === "option3"){
					
					if(questionFromTemplate.options.option3.multiplier === undefined){
						winningObj.multiplier = 4
					} else {
						winningObj.multiplier = parseFloat(questionFromTemplate.options.option3.multiplier)
					}
					winningObj.winnings = parseInt(winningObj.wager * winningObj.multiplier )
					winningObj.description = this.options.option3.title
					winningObj.correct = true
					return winningObj;
				} else if (play === "deleted") {
					winningObj.multiplier = 0
					winningObj.correct = false
					winningObj.winnings = parseInt(winningObj.wager)
					return winningObj;
				} else {
					winningObj.description = this.options.option3.title
					winningObj.multiplier = 0
					winningObj.correct = false
					winningObj.winnings = parseInt(winningObj.wager * winningObj.multiplier )
					return winningObj;
				}
				break;
			case "option4":
				if(play === "option4"){
					
					if(questionFromTemplate.options.option4.multiplier === undefined){
						winningObj.multiplier = 4
					} else {
						winningObj.multiplier = parseFloat(questionFromTemplate.options.option4.multiplier)
					}
					winningObj.winnings = parseInt(winningObj.wager * winningObj.multiplier )
					winningObj.description = this.options.option4.title
					winningObj.correct = true
					return winningObj;
				} else if (play === "deleted") {
					winningObj.multiplier = 0
					winningObj.correct = false
					winningObj.winnings = parseInt(winningObj.wager)
					return winningObj;
				} else {
					winningObj.description = this.options.option4.title
					winningObj.multiplier = 0
					winningObj.correct = false
					winningObj.winnings = parseInt(winningObj.wager * winningObj.multiplier )
					return winningObj;
				}
				break;
			case "option5":
				if(play === "option5"){
					
					if(questionFromTemplate.options.option5.multiplier === undefined){
						winningObj.multiplier = 4
					} else {
						winningObj.multiplier = parseFloat(questionFromTemplate.options.option5.multiplier)
					}
					winningObj.winnings = parseInt(winningObj.wager * winningObj.multiplier )
					winningObj.description = this.options.option5.title
					winningObj.correct = true
					return winningObj;
				} else if (play === "deleted") {
					winningObj.multiplier = 0
					winningObj.correct = false
					winningObj.winnings = parseInt(winningObj.wager)
					return winningObj;
				} else {
					winningObj.description = this.options.option5.title
					winningObj.multiplier = 0
					winningObj.correct = false
					winningObj.winnings = parseInt(winningObj.wager * winningObj.multiplier )
					return winningObj;
				}
				break;
			case "option6":
				if(play === "option6"){
					
					if(questionFromTemplate.options.option6.multiplier === undefined){
						winningObj.multiplier = 4
					} else {
						winningObj.multiplier = parseFloat(questionFromTemplate.options.option6.multiplier)
					}
					winningObj.winnings = parseInt(winningObj.wager * winningObj.multiplier )
					winningObj.description = this.options.option6.title
					winningObj.correct = true
					return winningObj;
				} else if (play === "deleted") {
					winningObj.multiplier = 0
					winningObj.correct = false
					winningObj.winnings = parseInt(winningObj.wager)
					return winningObj;
				} else {
					winningtrue.titleObj.multiplier = 0
					winningObj.correct = false
					winningObj.winnings = parseInt(winningObj.wager * winningObj.multiplier )
					return winningObj;
				}
				break;
		}
	}
});

