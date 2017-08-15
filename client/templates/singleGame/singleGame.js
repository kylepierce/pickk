Template.singleGame.onCreated(function() {
	var t = Template.instance();
	if (t.data.gamePlayed === 0){
		var gameId = t.data.game[0]._id
		Router.go('joinGame.show', {_id: gameId});
	}
	var userId = Meteor.userId();
	var game = Games.findOne();
	var data = {
		gameId: game._id,
		period: game.period,
		number: 3
	}
	Session.set('leaderboardData', data);

	var self = this
	self.getPeriod = function(){ return game.period }
	self.getCommercial = function(){ return game.commercial }

	self.autorun(function() {
		self.subscribe('joinGameCount', game._id, userId, self.getPeriod())
		self.subscribe('userQuestions', game._id, self.getCommercial())
	});
});

Template.singleGame.rendered = function () {
  $('#notification-center').slick({
    arrows: false,
    infinite: false,
    draggable: true,
    centerMode: true,
    centerPadding: '2.0%'
  });
  if(Meteor.isCordova){
    intercom.setLauncherVisibility('VISABLE');
  }
};

Template.singleGame.helpers({
  game: function(){
    return Games.findOne()
  },
	anyQuestions: function(){
		var currentUserId = Meteor.userId();
		var game = Games.findOne();
		var gamePlayed = GamePlayed.findOne();
		var gameType = gamePlayed.type
		var selector = {
			active: true,
			usersAnswered: {$nin: [currentUserId]}
		}

		if (gameType == "live" && game.commercial === false){
			var finish = Chronos.moment().subtract(gamePlayed.timeLimit, "seconds").toDate();
			selector.dateCreated = {$gt: finish}

		} else if (gameType === "atbat" && game.commercial === false){
			var finish = Chronos.moment().subtract(gamePlayed.timeLimit, "seconds").toDate();
			selector.dateCreated = {$gt: finish}
		}

		var count = Questions.find(selector).count();
		if (count > 0){
			$('#waiting-for-play').hide();
			return true
		} else {
			$('#waiting-for-play').show();
			return false
		}
	},
  scoreMessage: function() {
    var userId = Meteor.userId();
    var $game = Router.current().params._id
    var selector = {
      userId: userId,
      read: false,
      gameId: $game
    }
    var sort = {sort: {dateCreated: 1}, limit: 1}
    var notifications = Notifications.find(selector, sort);

    notifications.forEach(function(post) {
      var id = post._id
      var questionId = post && post.questionId
      var sAlertSettings = {effect: 'stackslide', html: true}

      if (questionId){
        Meteor.subscribe('singleQuestion', questionId)
        var question = Questions.findOne({_id: questionId});
        var title = question.que
      }

      if (post.source === "removed"){
        var message = 'Play: "' + title + '" was removed here are your ' + post.value + " coins!"

        sAlert.info(message, sAlertSettings);

      } else if (post.source === "overturned"){
        var message = '"' + title + '" was overturned. ' + post.value + " coins were removed"

        sAlert.info(message, sAlertSettings);
      } else if (post.type === "coins" && post.read === false) {
        var message = "You Won " + post.value + " coins! " + title
        sAlert.info(message, sAlertSettings);

      } else if (post.type === "diamonds" && post.read === false) {
        var message = '<img style="height: 40px;" src="/diamonds.png"> <p class="diamond"> ' + post.message + '</p>'

        sAlert.warning(message, sAlertSettings);
      }
      Meteor.call('removeNotification', id);
    });
  }
});

Template.singleGame.events({
  'click [data-action=game-leaderboard]': function(e, t){
    var gameId = Router.current().params._id
    var period = Games.findOne({_id: gameId}).period
    var userId = Meteor.userId()
    analytics.track("waiting-leaderboard", {
      userId: userId,
      gameId: gameId,
    });
    Router.go('/leaderboard/'+ gameId + "?period=" + period)
  },
  'click [data-action=previous-answers]': function(event, template){
    var $game = Router.current().params._id
    var userId = Meteor.userId()
    analytics.track("waiting-history", {
      userId: userId,
      gameId: $game,
    });
    Router.go('/history/' + $game )
  },
});

Template.liveGame.helpers({
	questionTypeIs: function(typeLooking, questionType) {
		if(typeLooking === questionType){
			return true
		}
	},
  commericalQuestions: function () {
		var game = Games.findOne({});
    var gamePlayed = GamePlayed.findOne({});
		if(game && game.commercial === true){
			var selector = {
				active: true,
				commercial: true,
				usersAnswered: {$nin: [Meteor.userId()]}
			}
			var sort = {sort: {dateCreated: 1}, limit: 1}
			return Questions.find(selector, sort).fetch();
		}
  },
  questions: function () {
		var game = Games.findOne({});
    var gamePlayed = GamePlayed.findOne({});
    var gameType = gamePlayed.type
		if (gameType === "live" || gameType === "atBat"){
      var selector = {
        active: true,
        commercial: false,
        usersAnswered: {$nin: [Meteor.userId()]}
      }
      var sort = {sort: {dateCreated: 1}, limit: 1}
      return Questions.find(selector, sort).fetch();
    }
  },
});

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
  }
});

Template.eventQuestion.events({
	'click [data-action=play-selected]': function (e, t) {
		$('.play-selected').removeClass('play-selected');
		$(e.currentTarget).addClass('play-selected');
		t.data.o = this.o;
		$('#wagers').show();
	},
	'click [data-action=wager-selected]': function (e, t) {
		$('.wager-selected').removeClass('wager-selected');
		$(e.currentTarget).addClass('wager-selected');

		t.data.w = $('.wager-selected')[0].value;
		$('#submitButton').show();
	},
	"click [data-action=submit]": function (e, t) {
		e.preventDefault();
		var userId = Meteor.userId()
		var o = this.o // option
		var q = this.q // question
		var t = this.t // type

		// a is for answer object
		var a = {
			userId: userId,
			gameId: q.gameId,
			questionId: q._id,
			period: q.period,
			type: t,
			answered: o.option,
			multiplier: o.multiplier,
			description: o.title
		}

		// Track what types of questions people are answering
		if(o.multiplier < 2.5){
			var multiplierRange = "low"
		} else if (o.multiplier < 4.5){
			var multiplierRange = "med"
		} else if (o.multiplier < 10){
			var multiplierRange = "high"
		} else if (o.multiplier < 99){
			var multiplierRange = "game changer"
		}

		if ( t === "freePickk" ){
			var w = this.wager // wager
			a.wager = w
		} else if ( t === "prediction" ){
			var userId = Meteor.userId();
			var createdAt = new Date();
			var gamePlayed = {
				gameId: q.gameId,
				userId: userId,
				dateCreated: createdAt
			}
			var joinedGame = GamePlayed.findOne(gamePlayed);
			if(!joinedGame){
				Meteor.call('userJoinsAGame', gamePlayed);
			}
			var w = "diamonds" // wager
			a.gameName = q.gameName
		} else {
			var w = this.w // wager
			// Normal Questions (i.e live, at bat, and drive)
			var selector = {userId: userId, gameId: q.gameId, period: q.period}
			var userCoins = GamePlayed.find(selector).fetch();
			var hasEnoughCoins = userCoins[0].coins >= w

			// Make sure the user has enough coins
			if (!hasEnoughCoins) {
				analytics.track("no coins", {
					id: a.userId,
					answered: a.answered,
					type: a.type,
					gameId: a.gameId,
					multiplier: o.multiplier,
					multiplierRange: multiplierRange,
					wager: w,
					userCoins: userCoins
				});

				IonLoading.show({
					customTemplate: '<h3>Not enough coins :(</h3><p>Lower the amount or or wait until the commercial for free pickks!</p>',
					duration: 1500,
					backdrop: true
				});
				return

			} else {
				// If they do add the wager to the answer object and set the last wager to whatever they predicted.
				a.wager = w
				Session.set('lastWager', w);
			}
		}

		// Remove the question from screen
		$(".single-question").removeClass("slideInLeft")
		$(".single-question").addClass("slideOutRight")

		analytics.track("question answered", {
			id: a.userId,
			answered: a.answered,
			period: a.period,
			type: a.type,
			gameId: a.gameId,
			multiplier: o.multiplier,
			multiplierRange: multiplierRange,
			wager: w,
		});

		if(Meteor.isCordova){
			//Intercom needs unix time with '_at' in JSON to work.
			var intercomData = {
				"last_question_answered_at": parseInt(Date.now() / 1000),
				"userId": a.userId,
			}
			updateIntercom(intercomData)
			Branch.setIdentity(a.userId)
			var eventName = 'question_answered';
			Branch.userCompletedAction(eventName)
		}

		var obj = {lastQuestion: new Date()}
		analytics.identify(a.userId, obj)

		var countdown = new ReactiveCountdown(250);
		countdown.start(function() {
			Meteor.call('playerInactive', a.userId, a.questionId);
		});

		setTimeout(function() {
			Meteor.call('questionAnswered', a);
		}, 250);
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
