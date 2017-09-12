Template.singleGame.onCreated(function() {
	var t = Template.instance();
	if (t.data.game.eventStatus.eventStatusId === 2 && t.data.gamePlayed === 0){
		var gameId = t.data.game._id
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
		// self.subscribe('userQuestions', game._id, self.getCommercial())
	});
});

Template.singleGame.rendered = function () {
  if(Meteor.isCordova){
    intercom.setLauncherVisibility('VISABLE');
  }
};

Template.singleGame.helpers({
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

Template.gameDisplay.helpers({
	status: function (eventStatusNumber){
		if (this.game.eventStatus.eventStatusId === eventStatusNumber){
			return true
		}
	}
});
