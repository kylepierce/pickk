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

    Meteor.call('answerFreePickk', prediction)
	},
});
