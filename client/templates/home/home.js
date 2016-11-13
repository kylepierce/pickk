Template.home.rendered = function () {
  $('.hero-section').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 20000,
    accessibility: false,
    arrows: false,
    mobileFirst: true,
  });
};

Template.home.helpers({
  hero: function () {
    return Hero.find({}).fetch()
  },
  gamePrediction: function () {
    return Questions.find({}).count()
  }, 
  dailyPickkCount: function () {
    var count = Questions.find({}).count()
    return count
  }
});

Template.home.events({
  'click [data-action=game-leaderboard]': function(event, template){
    var userId = Meteor.userId()
    analytics.track("home-leaderboard", {
      userId: userId,
    });
    Router.go('/week-leaderboard/')
  },
  'click [data-action=history]': function(event, template){
    var userId = Meteor.userId()
    analytics.track("home-history", {
      userId: userId,
    });
    Router.go('/history')
  }, 
  'click [data-action=notifications]': function(event, template){
    var userId = Meteor.userId()
    analytics.track("home-notifications", {
      userId: userId,
    });
    Router.go('/notifications')
  },
  'click [data-action=chat]': function(event, template){
    var userId = Meteor.userId()
    analytics.track("home-chat", {
      userId: userId,
    });
  }, 
  'click [data-action=game-prediction]': function(event, template){
    var userId = Meteor.userId()
    analytics.track("home-game-pickks", {
      userId: userId,
    });
    Router.go('/daily-pickks')
  }, 
});

Template.outDisplay.helpers({
  outs: function (number) {
    var out = "<div class='out'></div>"
    var noOut = "<div class='no-out'></div>"

    var repeat = function (s, n) {
      return --n ? s + ("") + repeat(s, n) : "" + s;
    };

    if (number === 0) {
      return repeat(noOut, 3) 
    } else if (number === 3) {
      return repeat(out, 3)
    } else {
      var diff = Math.abs(number - 3)
      var outs = repeat(out, number)
      var noOuts = repeat(noOut, diff)
      return outs + noOuts
    }
  },
});

Template.count.helpers({
  count: function () {
    var gameId = this.gameId
    Meteor.subscribe('singleAtBat', gameId)
    return AtBat.findOne({gameId: gameId})
    
  }
});

Template.teamBlock.helpers({
  teamColors: function (id) {
    Meteor.subscribe('singleTeam', id)
    var team = Teams.findOne({_id: id})
    var hex = team && team.hex
    if(hex){
      var color = "#" + team.hex[0]
    } else {
      var color = "#134A8E"
    }
    return color
  },
  whoHasBall: function () {
    return false
  },
});

Template.singleGameInfo.helpers({
  inProgress: function () {
    if (this.game.live === true){
      return true
    }
  },
  future: function () {
    if (this.game.status === "scheduled"){
      return true
    }
  },
  past: function () {
    if (this.game.status === "closed" || this.game.status === "completed"){
      return true
    }
  },
  baseball: function () {
    var football = this.game && this.game.football
    if (!football){
      return true
    }
  }
});

Template.gameInProgressInfo.helpers({
  baseball: function () {
    var football = this.game && this.game.football
    if (!football){
      return true
    }
  }
});

Template.inningDisplay.helpers({
  grammer: function (inning) {
    
    if([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].indexOf(inning) >= 0) {
      var inningGrammer = inning + "th"
    } else if ([1].indexOf(inning) >= 0) {
      var inningGrammer = inning + "st"
    } else if ([2].indexOf(inning) >= 0) {
      var inningGrammer = inning + "nd" 
    } else if ([3].indexOf(inning) >= 0) {
      var inningGrammer = inning + "rd"
    } 
    return inningGrammer
  }
});

Template.futureGameInfo.helpers({
  displayDate: function (date) {
    function compare(today, game) {
      var momentA = moment(today,"MM/DD/YYYY", true).date();
      var momentB = moment(game,"MM/DD/YYYY", true).date();
      if (momentA > momentB) return 1;
      else if (momentA < momentB) return -1;
      else return 0;
    }
    var gameTime = moment(date)
    var now = moment();
    var futureOrToday = compare(now, gameTime)
    var timezone = Meteor.user().profile.timezone
    // var timezone = jstz.determine();
    if (!timezone) {var timezone = "America/New_York"}
    
    if (futureOrToday == 1){
      return "Closed"
    } else if (futureOrToday === 0) {
      return gameTime.tz(timezone).format("h:mm a z");
    } else {
      return gameTime.tz(timezone).format("MMM Do h:mm a z");
    }
  }
});

Template.pastGameInfo.events({
  'click [data-action=game-leaderboard]': function (e, t) {
    var gameId = t.data.game._id
    Router.go('/leaderboard/' + gameId)
  },
  'click [data-action=game-predictions]': function (e, t) {
    var gameId = t.data.game._id
    Router.go('/history/' + gameId)
  }
});

Template.singleGameCTA.helpers({
  inProgress: function () {
    if (this.game.live === true){
      return true
    }
  },
  future: function () {
    if (this.game.status === "scheduled"){
      return true
    }
  }
});

Template.singleGameCTA.events({
  'click [data-action=play]': function ( e, t ) {
    var gameId = this.game._id
    Meteor.call('userJoinsAGame', Meteor.userId(), gameId);
    Router.go('game.show', {_id: gameId});
  }
});