Template.singleGame.rendered = function () {
  $('#notification-center').slick({
    arrows: false,
    infinite: false,
    draggable: true,
    centerMode: true,
    centerPadding: '4.5%'
  });
  if(Meteor.isCordova){
    intercom.setLauncherVisibility('VISABLE');
  }
};

Template.waitingForNextPlay.onCreated(function() {
  var userId = Meteor.userId()
  var gameId = Router.current().params._id
  this.subscribe('leaderboardGamePlayed', gameId, 0, 5)
});

Template.singleGame.helpers({
  game: function(){
    return Games.findOne()
  },
  joinedGame: function (){
    var game = Games.findOne();
    var gameId = game._id
    var userId = Meteor.userId();
    var gamePeriod = game.period
    var gamePlayed = {
      gameId: gameId,
      userId: userId,
      period: gamePeriod
    }
    Meteor.subscribe('joinGameCount', gamePlayed)
    var count = Counts.get('joinGameCount')
    if (count === 1){
      return true
    }
  },
  notJoinedGame: function (){
    var count = Counts.get('joinGameCount')
    if (count === 0){
      return true
    }
  },
  gameCompleted : function () {
    var game = Games.findOne();
    if (game.live === false && game.completed === true) {
      return true
    }
  },
  isLive: function () {
    var game = Games.findOne();
    var gameId = game._id
    var userId = Meteor.userId();
    if (game.status === "inprogress"){
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

Template.liveGame.onCreated(function (){
  var userId = Meteor.userId();
  var gameId = Router.current().params._id
  var period = this.data.game[0].period
  this.subscribe('gamePlayed', userId, gameId)
  this.subscribe('activeQuestions', gameId, period)
  this.subscribe('activeCommQuestions', gameId, period)
  this.subscribe('activePropQuestions', gameId, period)
});

Template.liveGame.helpers({

  commericalBreak: function (){
    var game = Games.findOne();
    if (game.commercial === true) {
      return true
    }
  },
  props: function () {
    var currentUserId = Meteor.userId()

    var selector = {
      type: "prop",
      active: true,
      usersAnswered: {$nin: [currentUserId]}
    }

    var sort = {sort: {dateCreated: -1}}
    var q = Questions.find(selector, sort).fetch();
    return q
  },
  prop: function () {
    var currentUserId = Meteor.userId()

    var selector = {
      type: "prop",
      active: true,
      usersAnswered: {$nin: [currentUserId]}
    }
    var sort = {sort: {dateCreated: -1}}
    var q = Questions.find(selector, sort).fetch();
    return q
  },
  commericalQuestions: function () {
    var currentUserId = Meteor.userId()

    var selector = {
      active: true,
      commercial: true,
      usersAnswered: {$nin: [currentUserId]}
    }
    var sort = {sort: {dateCreated: 1}, limit: 1}
    return Questions.find(selector, sort).fetch();
  },
  questions: function () {
    // Only show questions that are 'gamePlayed.time' old
    var currentUserId = Meteor.userId()
    var gamePlayed = GamePlayed.findOne({})
    var timeLimit = gamePlayed.timeLimit
    var gameType = gamePlayed.type
    if (gameType === "live"){
      var finish = Chronos.moment().subtract(timeLimit, "seconds").toDate();

      var selector = {
        active: true,
        commercial: false,
        dateCreated: {$gt: finish},
        usersAnswered: {$nin: [currentUserId]},
      };
      var sort = {sort: {dateCreated: 1}, limit: 1}
      return Questions.find(selector, sort).fetch();
    }
  },
  noQuestions: function () {
    var userId = Meteor.userId()
    var gameId = Games.findOne()._id
    var game = Games.find({_id: gameId}).fetch();
    var period = game[0].period
    var commercial = game[0].commercial
    Meteor.subscribe('questionCount', userId, gameId, period, commercial)
    var count = Counts.get('questionCount')
    if (count === 0){
      return true
    }
  },
});

Template.singleGame.events({
  'click [data-action=game-leaderboard]': function(event, template){
    var $game = Router.current().params._id
    var $period = Games.findOne({}).period
    var userId = Meteor.userId()
    analytics.track("waiting-leaderboard", {
      userId: userId,
      gameId: $game,
    });
    Router.go('/leaderboard/'+ $game + "/" + $period)
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
      insertedTemplate: Template.wagers,
      containerId: "wagers",
      event: e,
      selected: $selected,
      template: t,
      dataPath: this,
    }

    displayOptions( parms )
  },
  'click [data-action=wager-selected]': function (e, t) {
    $('.wager-selected').removeClass('wager-selected')
    $(e.currentTarget).addClass('wager-selected')

    Session.set('lastWager', this.w);
    var $selected = $('.wagers')

    parms = {
      insertedTemplate: Template.submitButton,
      containerId: "submit",
      event: e,
      selected: $selected,
      template: t,
      dataPath: this,
    }
    displayOptions( parms )
  }
});

Template.noPlay.rendered = function(){
  var userId = Meteor.userId()
  var gameId = Games.findOne()._id
  var game = Games.find({_id: gameId}).fetch();
  var period = game[0].period
  var commercial = game[0].commercial
  Meteor.subscribe('questionCount', userId, gameId, period, commercial)
  var count = Counts.get('questionCount')
  console.log("count", count);
};

Template.commericalQuestion.helpers({
  freePickk: function (q) {
    if(q.binaryChoice === true){
      return true
    }
  },
  propQuestion: function (q) {
    if (q.type === "prop"){
      return true
    }
  },
  driveQuestion: function (q) {
    if (q.type === "drive"){
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

    displayOptions( parms )
  }
});

Template.singleQuestion.helpers({
  propQuestions: function (q) {
    if(q.type === "prop"){
      return true
    }
  },
  eventQuestions: function (q) {
    if(q.atBatQuestion || q.event){
      return true
    }
  },
  liveQuestion: function (q) {
    var live = q && q.type === "live"
    var play = q && q.type === "play"
    if(live || play){
      return true
    }
  },
  dailyPickk: function (q) {
    if(q.type === "prediction"){
      return true
    }
  }
});

Template.eventQuestion.helpers({
  liveQuestion: function (q) {
    if (q.type === "play"){
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
