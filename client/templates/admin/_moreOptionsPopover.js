Template._moreOptions.helpers({
  options: function (q) {
    console.log(q);
	  var imported = q
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
    console.log(optionsArray);
	  return optionsArray
	}
});

Template._moreOptions.events({
	'click .item': function (e, t) {
    var updateQuestion = {
      questionId: t.data.q._id,
      option: this.id,
      type: "two"
    }
    Meteor.call('modifyQuestionStatus', updateQuestion)
    IonPopover.hide();
	}
});
