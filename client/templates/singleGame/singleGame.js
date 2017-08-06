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

		var count = Questions.find(selector).count()

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
    var currentUserId = Meteor.userId()
    var gamePlayed = GamePlayed.findOne({});
    var timeLimit = gamePlayed.timeLimit
    var gameType = gamePlayed.type
    if (gameType === "live" || gameType === "atBat"){
      var finish = Chronos.moment().subtract(timeLimit, "seconds").toDate();
      var selector = {
        active: true,
        commercial: false,
        dateCreated: {$gt: finish},
        usersAnswered: {$nin: [currentUserId]},
      }
      var sort = {sort: {dateCreated: 1}, limit: 1}
      return Questions.find(selector, sort).fetch();
    }
  },
});

Template.commericalQuestion.helpers({
	questionTypeIs: function(typeLooking, questionType) {
		if(typeLooking === questionType){
      return true
    }
	}
});

Template.commericalQuestion.events({
  'click [data-action=pickk]': function (e, t) {
    $('.play-selected').removeClass('play-selected')
    $(e.currentTarget).addClass('play-selected')

    var count = _.keys(this.q.options).length
    var selectedNumber = this.o.number
    var squareOptions = count === 2

    if (selectedNumber % 2 !== 0 && squareOptions){
      var selectedIsOdd = true
      var $selected = $(e.currentTarget).next()
    } else {
      var selectedIsOdd = false
      var $selected = $(e.currentTarget)
    }

    parms = {
      insertedTemplate: Template.submitButton,
      containerId: "submit",
      event: e,
      selected: $selected,
      template: t,
      dataPath: this,
    }

    // displayOptions( parms )
  }
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
		var container = $('.single-question')[0];
		$('#wagers').show();
	},
	'click [data-action=wager-selected]': function (e, t) {
		$('.wager-selected').removeClass('wager-selected');
		$(e.currentTarget).addClass('wager-selected');

		Session.set('lastWager', this.w);
		t.data.w = $('.wager-selected')[0].value;

		$('#submitButton').show();
	}
});

Template.option.helpers({
  hasIcon: function (q) {
    if (q.icons){
      return true
    }
  },
  binary: function(){
    var count = _.keys(this.q.options).length
    if (count === 2 || count === 4 || count === 6){
      return "square-options"
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
