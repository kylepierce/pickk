Template.dailyPickks.rendered = function () {
  var now = moment();
  var userId = Meteor.userId();
  var dateSpelled = moment(now,"MM/DD/YYYY", true).format("MMM Do YYYY");
  var title = dateSpelled + " Predictions"
  var game = Games.findOne({name: title});
  if(game){
    var gameId = game._id
    Meteor.subscribe('singleGame', gameId);
    Meteor.subscribe('gameNotifications', gameId, userId);
    Meteor.subscribe('gamePlayed', userId, gameId);
  }
};

Template.dailyPickks.helpers({
  questionsExist: function () {
    var currentUserId = Meteor.userId()
    var selector = {active: true, usersAnswered: {$nin: [currentUserId]}}
    return Questions.find(selector).count()
  },
	dailyPickks: function () {
    var currentUserId = Meteor.userId()
    var selector = {active: true, usersAnswered: {$nin: [currentUserId]}}
		return Questions.find(selector, {limit: 1}).fetch();
	},
  scoreMessage: function() {
    var userId = Meteor.userId();
    var notifications = Notifications.find().fetch();
    console.log(notifications)
    notifications.forEach(function(post) {
      var id = post._id
      if (post.type === "diamonds" && post.read === false) {
        message = '<img style="height: 40px;" src="/diamonds.png"> <p class="diamond"> ' + post.message + '</p>'

        Meteor.call('removeNotification', id);

        sAlert.warning(message, {effect: 'stackslide', html: true});
      }
    });
  }
});

Template.dailyPickks.onCreated(function() {
  var userId = Meteor.userId();
  var now = moment();
  var userId = Meteor.userId();
  var dateSpelled = moment(now,"MM/DD/YYYY", true).format("MMM Do YYYY");
  var title = dateSpelled + " Predictions"
  var game = Games.findOne({name: title});
  var gameId = game._id
  this.subscribe('gameNotifications', gameId, userId);
});

Template.dailyPickks.events({
	'click [data-action=play-selected]': function (e, t) {
    $('.play-selected').removeClass('play-selected')
    $(e.currentTarget).addClass('play-selected')

    var count = _.keys(this.q.options).length
    var selectedNumber = this.o.number
    var squareOptions = count === 2 || count === 4 || count === 6
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
      selected: $selected,
      event: e,
      template: t,
      dataPath: this,
    }
    displayOptions( parms )
  },
});
