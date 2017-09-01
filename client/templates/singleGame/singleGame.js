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
    centerPadding: '10px'
  });
	$.each($(".complete-game-card"), function(i, el){
		setTimeout(function(){
			$(el).css("opacity","1");
			$(el).addClass("fadeInLeft","400");
		}, 100 + ( i * 100 ));
	});
  if(Meteor.isCordova){
    intercom.setLauncherVisibility('VISABLE');
  }
};

Template.singleGame.helpers({
  game: function(){
    return Games.findOne();
  },
	sport: function(sport){
		if (this.game[0].sport === sport){
			return true
		}
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
		$('#wagers').show();
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

Template.footballInfoCard.helpers({
	down: function(){
		var down = this.game[0].eventStatus.down
		switch (down) {
			case 1:
				var down = down + "st"
				break;
			case 2:
				var down = down + "nd"
				break;
			case 3:
				var down = down + "rd"
				break;
			case 4:
				var down = down + "th"
				break;
			default:
				var down = "---"
				break;
		}
		return down
	},
	distance: function(){
		return this.game[0].eventStatus.distance
	},
	location: function(){
		return "@" + this.game[0].location
	},
	quarter: function(){
		var period = this.game[0].eventStatus.period
		switch (period) {
			case 1:
				var period = period + "st"
				break;
			case 2:
				var period = period + "nd"
				break;
			case 3:
				var period = period + "rd"
				break;
			default:
				var period = period + "th"
				break;
		}
		return period
	},
	time: function(){
		var seconds = this.game[0].eventStatus.seconds.toString()
		if (seconds && seconds.length < 2) {
			var seconds = "0" + seconds
		}
		return this.game[0].eventStatus.minutes + ":" + seconds
	},
	ballLocation: function(){
		return "70%"
	},
	yardsToGo: function(){
		return "10%"
	},
	away: function (){
		statsTeamId = this.game[0].teams[0].teamId
		Meteor.subscribe('singleTeam', statsTeamId);
		return Teams.findOne({"statsTeamId": statsTeamId});
	},
	home: function() {
		statsTeamId = this.game[0].teams[1].teamId
		Meteor.subscribe('singleTeam', statsTeamId);
		return Teams.findOne({"statsTeamId": statsTeamId});
	},
	shortCode: function() {
		return this.computerName.toUpperCase()
	},
	hexColor: function(){
		return "#" + this.hex[0]
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


// var countdown = new ReactiveCountdown(250);
// countdown.start(function() {
// 	Meteor.call('playerInactive', a.userId, a.questionId);
// });

// 	} else if ( t === "prediction" ){
// 		var userId = Meteor.userId();
// 		var createdAt = new Date();
// 		var gamePlayed = {
// 			gameId: q.gameId,
// 			userId: userId,
// 			dateCreated: createdAt
// 		}
// 		var joinedGame = GamePlayed.findOne(gamePlayed);
// 		if(!joinedGame){
// 			Meteor.call('userJoinsAGame', gamePlayed);
// 		}
// 		var w = "diamonds" // wager
// 		a.gameName = q.gameName
// 	}
