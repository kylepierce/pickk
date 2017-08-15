Template.singleGameCard.helpers({
  status: function() {
    if(this.game.status === "In-Progress") {
      return "left-side-team-block "
    } else if (this.game.status === "Pre-Game"){
      return "left-side-team-block "
    } else {
      return "full-width-team-block"
    }
  },
  scheduled: function () {
    if (this.game.status === "scheduled" || this.game.status === "Pre-Game"){
      return true
    }
  },
  registered: function (){
    var userId = Meteor.userId()
    var list = this.game.registered
    var alreadyRegistered = _.indexOf(list, userId)
    if(alreadyRegistered !== -1) {
      return true
    }
  },
});

Template.singleGameCard.events({
  'click [data-action=register]': function () {
    var userId = Meteor.userId();
    Meteor.call('registerForGame', userId, this.game.name);
    sAlert.success("Registered for " + this.game.name + " !" , {effect: 'slide', position: 'bottom', html: true});
  },
  'click [data-action=unregister]': function () {
    var userId = Meteor.userId();
    Meteor.call('unregisterForGame', userId, this.game._id);
    sAlert.success("Removed Registration for " + this.game.name + "." , {effect: 'slide', position: 'bottom', html: true});
  }
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
    }  else {
      var diff = Math.abs(number - 3)
      var outs = repeat(out, number)
      var noOuts = repeat(noOut, diff)
      return outs + noOuts
    }
  },
});

Template.teamBlock.helpers({
  team: function (statsTeamId) {
    Meteor.subscribe('singleTeam', statsTeamId);
    return Teams.findOne({"statsTeamId": statsTeamId});
  },
  score: function () {
    var template= Template.parentData();
    var statsTeamId = this.statsTeamId
    if (template.game && template.game.status !== "Pre-game") {
      _.map (template.game.scoring, function(team) {
        if (team.id === statsTeamId){
          console.log(team.runs);
          return team
        }
      });
    }
  },
  hex: function () {
    if (this.hex){
      return "#" + this.hex[0]
    } else {
      return "#134A8E"
    }
  },
});

Template.singleGameInfo.helpers({
  inProgress: function () {
    if (this.game.live === true){
      return true
    }
  },
  future: function () {
    if (this.game.status === "scheduled" || this.game.status === "Pre-Game"){
      return true
    }
  },
  past: function () {
    if (this.game.status === "closed" || this.game.status === "completed"){
      return true
    }
  },
  baseball: function () {
    var live = this.game.live
    var baseball =  this.game.sport === "MLB"
    if (live && baseball){
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
  },
  position: function(data){
    if(data === "Top"){
      return true
    }
  }
});

Template.playersOnBase.helpers({
  empty: function(bases){
    if(bases.length === 0){
      return true
    }
  },
  playerOnBase: function (number, base) {
    if(base && base.length > 0){
      for (var i = 0; i < 2; i++) {
        if (base[i] && base[i].baseNumber === number){
          return true
        }
      }
    }
  },
});

Template.futureGameInfo.helpers({
  displayDate: function (date) {
    function compare(today, game) {
      var momentA = moment(today,"MM/DD/YYYY", true).dayOfYear();
      var momentB = moment(game,"MM/DD/YYYY", true).dayOfYear();
      if (momentA > momentB) return 1;
      else if (momentA < momentB) return -1;
      else return 0;
    }
    var gameTime = moment(date)
    var now = moment();
    var futureOrToday = compare(now, gameTime)
    var timezone = Meteor.user().profile.timezone
    if (!timezone) {var timezone = "America/New_York"}

    if (futureOrToday == 1){
      return "Closed"
    } else if (futureOrToday === 0) {
      return gameTime.tz(timezone).format("h:mm a z");
    } else {
      return gameTime.tz(timezone).format("MMM Do h:mm a z");
    }
  },
  tv: function(data) {
    return data
  },
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
    if (this.game.status === "scheduled" || this.game.status === "Pre-Game"){
      return true
    }
  },
  tv: function(data) {
    return data
  },
  quarter: function (num) {
    // return num
    if(this.game.sport === "NFL"){
      switch(num){
        case 1:
          return "1st Quarter"
          break;
        case 2:
          return "2nd Quarter"
          break;
        case 3:
          return "3rd Quarter"
          break;
        case 4:
          return "4th Quarter"
          break;
        case 5:
          return "Overtime"
          break;
      }
    } else {
      return num
    }
  },
  football: function(){
    if(this.game.sport === "NFL"){
      return true
    }
  },
  baseball: function(){
    if(this.game.sport === "MLB"){
      return true
    }
  }
});

Template.singleGameCTA.events({
  'click [data-action=play]': function ( e, t ) {
    var gameId = this.game._id
    Router.go('joinGame.show', {_id: gameId});
  }
});
