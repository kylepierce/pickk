Template._gamePopover.helpers({
	options: function (q) {
    var data = q.options
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

Template._gamePopover.events({
	'click [data-action=selection]': function(e,t) {
		var option = this.o.option
		var questionId = this.q._id
		Meteor.call('modifyGameQuestionStatus', questionId, option)
		IonPopover.hide();
	},
})
