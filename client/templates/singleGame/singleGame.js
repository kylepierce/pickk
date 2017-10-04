Template.singleGame.onCreated(function() {
	var gameId = Router.current().params._id;
	var self = this
	self.autorun(function() {
		self.subscribe('gameNotifications', gameId);
		self.subscribe('singleGame', gameId);
		self.subscribe('gamePlayed', gameId);
	});
});

Template.singleGame.rendered = function () {
  if(Meteor.isCordova){
    intercom.setLauncherVisibility('VISABLE');
  }
};

Template.singleGame.helpers({
	game: function(){
		var t = Template.instance();
		var game = Games.findOne();
		return game
	},
	status: function (eventStatusNumber){
		var game = Games.findOne();
		if (game.eventStatus.eventStatusId === eventStatusNumber){
			return true
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
