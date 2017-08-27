Template.dailyQuestion.helpers({
  options: function (q) {
    var imported = q
    var data = this.q.options
    var keys = _.keys(data)
    var values = _.values(data)
    var optionsArray = []

    // [{number: option1}, {title: Run}, {multiplier: 2.43}]
    for (var i = 0; i < keys.length; i++) {
      var obj = values[i]
      var number = keys[i]
      obj["option"] = number
      optionsArray.push(obj)
    }

    return optionsArray
  },
	// background: function() {
	// 	var game = Games.findOne({_id: this.q.gameId})
	// 	if (game.sport === "NFL"){
	// 		return "background: linear-gradient(rgba(34, 44, 49, .0), rgba(34, 44, 49, .5)), url('/question-background.png'); height: 75px; background-position-x: 46%; background-position-y: 100%; "
	// 	}
	// }
});

Template.dailyQuestion.events({
	'click [data-action=play-selected]': function (e, t) {
		e.preventDefault();

		var userId = Meteor.userId();
		var selector = {userId: userId, gameId: this.q.gameId}

		if(Meteor.isCordova){
			//Intercom needs unix time with '_at' in JSON to work.
			var intercomData = {
				"last_daily_question_answered_at": parseInt(Date.now() / 1000),
				"userId": userId,
			}
			updateIntercom(intercomData)
			Branch.setIdentity(userId)
			var eventName = 'daily_question_answered';
			Branch.userCompletedAction(eventName)
		}

		analytics.identify(userId, {lastQuestion: new Date()})

		$(".single-question").removeClass("slideInLeft")
		$(".single-question").addClass("slideOutRight")

    var prediction  = {
      gameId: this.q.gameId,
  		questionId: this.q._id,
  		answer: this.o.option,
  		multiplier: this.o.multiplier,
      type: "free-pickk"
    }
		Meteor.call('answerDailyPickk', prediction);
	}
});
