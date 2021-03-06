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
		} else if (game.sport === "MLB"){
      return "background: linear-gradient(rgba(34, 44, 49, .0), rgba(34, 44, 49, .5)), url('/daily-diamond.png'); height: 75px; background-position-x: 46%; background-position-y: 100%; "
		}
	}
});

Template.eventQuestion.events({
	'click [data-action=play-selected]': function (e, t) {
		$('.play-selected').removeClass('play-selected');
		$(e.currentTarget).addClass('play-selected');
		t.data.o = this.o;
    var lastWager = Session.set('lastPlay', this.o);
    if(!t.data.wager){ //Pre game pickk hack
      var lastWager = Session.set('lastWager', 2500);
      $('#submitButton').show();
    }
		// $('#wagers').show();
	},
	'click [data-action=wager-selected]': function (e, t) {
		$('.wager-selected').removeClass('wager-selected');
		$(e.currentTarget).addClass('wager-selected');
		t.data.w = $('.wager-selected')[0].value;
    $('#submitButton').show();
  },
	"click [data-action=submit]": function (e, t) {
    var lastPlay = Session.get('lastPlay');
    if (!this.o && !lastPlay){
      IonLoading.show({
        customTemplate: '<h3>Select an Option!</p>',
        duration: 1500,
        backdrop: true
      });
    }
		e.preventDefault();
    var lastWager = Session.get('lastWager');
    
		var multiplier = parseFloat(lastPlay.multiplier);
		var userId = Meteor.userId();
		var selector = {userId: userId, gameId: this.q.gameId, period: this.q.period}

    var userCoins = GamePlayed.findOne(selector)
		var hasEnoughCoins = userCoins.coins >= lastWager


		if (!hasEnoughCoins) {
			analytics.track("no coins", {
				id: userId,
				where: "Client",
				answered: lastPlay.option,
				type: this.t.type,
				gameId: this.q.gameId,
				multiplier: lastPlay.multiplier,
				wager: lastWager,
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
			Branch.setIdentity(userId)
			var eventName = 'question_answered';
			Branch.userCompletedAction(eventName)
		}

		analytics.identify(userId, {lastQuestion: new Date()})
		$(".single-question").removeClass("slideInLeft")
		$(".single-question").addClass("slideOutRight")

		var prediction = {
			gameId: this.q.gameId,
			period: this.q.period,
			questionId: this.q._id,
			type: this.t,
			answered: lastPlay.option,
			multiplier: multiplier,
			wager: lastWager
		}

    if(multiplier < 2.5){
      var multiplierRange = "low"
    } else if (multiplier < 4.5){
      var multiplierRange = "med"
    } else if (multiplier < 10){
      var multiplierRange = "high"
    } else if (multiplier < 99){
      var multiplierRange = "game changer"
    }

		Meteor.call('answerNormalQuestion', prediction, function(error, response){
      if (error){
        console.log(error);
      } else {        
        analytics.track("question answered", {
          gameId: prediction.gameId,
          period: prediction.period,
          questionId: prediction._id,
          type: prediction.type,
          answered: prediction.answered,
          userId: Meteor.userId(),
          multiplier: prediction.multiplier,
          multiplierRange: multiplierRange,
          wager: prediction.wager
        });
      }
    });
    QuestionPopover.hide();
    var countdown = new ReactiveCountdown(250);
    var questionId = this.q._id
    countdown.start(function() {
      Meteor.call('playerInactive', Meteor.userId(), questionId);
    });
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
