Template.freePickkQuestion.helpers({
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
  background: function() {
    var game = Games.findOne({_id: this.q.gameId})
    if (game.sport === "NFL"){
      return "background: linear-gradient(rgba(34, 44, 49, .0), rgba(34, 44, 49, .5)), url('/question-background.png'); height: 75px; background-position-x: 46%; background-position-y: 100%; "
    }
  }
});

Template.freePickkQuestion.events({
	'click [data-action=free-pickk]': function (e, t) {
		$('.play-selected').removeClass('play-selected');
		$(e.currentTarget).addClass('play-selected');
		Template.currentData().o = this.o;

    var prediction = {
      gameId: this.q.gameId,
      period: this.q.period,
      questionId: this.q._id,
      answered: this.o.option,
      multiplier: this.o.multiplier,
      wager: this.w,
      type: "free-pickk"
    }

    analytics.track("question answered", {
      gameId: this.q.gameId,
      period: this.q.period,
      questionId: this.q._id,
      type: this.t,
      answered: this.o.option,
      userId: Meteor.userId(),
    });

    Meteor.call('answerFreePickk', prediction)
	},
});
