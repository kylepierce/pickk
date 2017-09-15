Template.eventQuestion.helpers({
  liveQuestion: function (q) {
		var list = ["live", "play", "atBat", "pitch"]
		var included = list.indexOf(q.type)
    if(q && included > 0){
      return true
    }
  },
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

Template.eventQuestion.events({
	'click [data-action=play-selected]': function (e, t) {
		$('.play-selected').removeClass('play-selected');
		$(e.currentTarget).addClass('play-selected');
		t.data.o = this.o;
		// $('#wagers').show();
	},
	// 'dblclick [data-action=play-selected]': function (e, t){
	// 	console.log(e, t);
	// },
	'click [data-action=wager-selected]': function (e, t) {
		$('.wager-selected').removeClass('wager-selected');
		$(e.currentTarget).addClass('wager-selected');
		t.data.w = $('.wager-selected')[0].value;
		$('#submitButton').show();
	},
	"click [data-action=submit]": function (e, t) {
		e.preventDefault();

		var multiplier = parseFloat(this.o.multiplier);
		var userId = Meteor.userId();
		var selector = {userId: userId, gameId: this.q.gameId, period: this.q.period}

		var userCoins = GamePlayed.find(selector).fetch();
		var hasEnoughCoins = userCoins[0].coins >= this.w

		if (!hasEnoughCoins) {
			analytics.track("no coins", {
				id: userId,
				where: "Client",
				answered: this.o.option,
				type: this.t.type,
				gameId: this.q.gameId,
				multiplier: this.o.multiplier,
				wager: this.w,
				userCoins: userCoins
			});

			IonLoading.show({
				customTemplate: '<h3>Not enough coins :(</h3><p>Lower the amount or or wait until the commercial for free pickks!</p>',
				duration: 1500,
				backdrop: true
			});
			return
		}

		if(Meteor.isCordova){
			//Intercom needs unix time with '_at' in JSON to work.
			var intercomData = {
				"last_question_answered_at": parseInt(Date.now() / 1000),
				"userId": userId,
			}
			updateIntercom(intercomData)
			Branch.setIdentity(userId)
			var eventName = 'question_answered';
			Branch.userCompletedAction(eventName)
		}

		analytics.identify(userId, {lastQuestion: new Date()})
		Session.set('lastWager', this.w);
		$(".single-question").removeClass("slideInLeft")
		$(".single-question").addClass("slideOutRight")

		var prediction = {
			gameId: this.q.gameId,
			period: this.q.period,
			questionId: this.q._id,
			type: this.t,
			answered: this.o.option,
			multiplier: multiplier,
			wager: this.w
		}

		Meteor.call('answerNormalQuestion', prediction);
	}
});

Template.option.helpers({
  hasIcon: function (q) {
    if (q.icons){
      return true
    }
  }
});

displayOptions = function ( o ) {
  // The select item dom and data
  var $selected = o.selected
  var selectedObj = o.dataPath
  var templateName = o.insertedTemplate

  var addOptions = function ( id, data ){
    var options = "<div id='" + id + "'></div>"
    $selected.after(options);
    var container = $('#' + id + '')[0]
    Blaze.renderWithData(templateName, data, container)
  }

  var container = $('#' + o.containerId + '')[0]
  if ( container ){
    container.remove();
    addOptions( o.containerId, selectedObj )
  } else {
    addOptions( o.containerId, selectedObj )
  }
}
