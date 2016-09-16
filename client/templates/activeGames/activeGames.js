Template.activeGames.rendered = function () {
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

Template.activeGames.helpers({
  hero: function () {
    return Hero.find({}).fetch()
  },
  games: function ( ) {
    return Games.find({live: true}, {sort: {}}).fetch();
  },
  gameClass: function () {
    return "game-item-" + this['status'];
  },  
  notBeta: function () {
    var betaUser = Meteor.user().profile.role
    if(betaUser === "beta" || betaUser === "admin"){
      return false
    }
  },
  userGroups: function() {
    var currentUser = Meteor.userId();
    return Groups.find({members: currentUser}).fetch()
  },
  groups: function(){
    var currentUser = Meteor.user();
    var groupCount = currentUser.profile.groups.length 
    if (groupCount){
      return true
    }
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
    Router.go('game.show', {id: gameId});
  }
});