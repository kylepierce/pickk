Template.entireGameCard.onCreated( function() {
  var team1 = this.data.game.away_team
  var team2 = this.data.game.home_team
  if (team1 && team2){
    this.subscribe( 'singleGameTeams', team1, team2, function() {
      $( ".loading-wrapper").show();
    });
  }
});

Template.entireGameCard.helpers({
  status: function () {
    if(this.game.sport === "MLB" && this.game.status === "In-Progress") {
      return "baseball-game-card"
    } else if (this.game.status === "Pre-Game"){
      return "pre-game-card"
    } else if (this.game.status === "In-Progress"){
      return "live-game-card"
    }
  }
});

Template.entireGameCard.events({
  'click [data-action=viewGame]': function(){
    var gameId = this.game._id
    Router.go('/game/' + gameId );
  }
});

Template.singleGameInfo.onCreated( function() {
  var team1 = this.data.game.away_team
  var team2 = this.data.game.home_team
  if (team1 && team2){
    this.subscribe( 'singleGameTeams', team1, team2, function() {
      $( ".loading-wrapper").show();
    });
  }
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
  sport: function (sport) {
    if (this.game.live && this.game.sport === sport){
      return true
    }
  }
});

Template.singleGameCard.helpers({
  status: function() {
    if(this.game) {
      if(this.game.status === "In-Progress") {
        return "left-side-team-block "
      } else if (this.game.status === "Pre-Game"){
        return "left-side-team-block "
      }
      // else if (this.game.eventStatus.eventStatusId === 5){
      //   return "left-side-team-block "
      // }
      else {
        return "full-width-team-block"
      }
    }
  },
  showRight: function() {
    if(this.game) {
      if(this.game.status === "In-Progress") {
        return true
      } else if (this.game.status === "Pre-Game"){
        return true
      } else if (this.game.status === "closed" || this.game.status === "completed"){
        return true
      }
      // else if (this.game.eventStatus.eventStatusId === 5 ){
      //   return true
      // }
      else {
        return false
      }
    }
  },
  teams: function () {
    if (this.game.teams){
      var teams = _.values(this.game.teams);
      if (this.game.scoring){
        teams[1].runs = this.game.scoring.home.runs;
        teams[0].runs = this.game.scoring.away.runs;
      } else if (this.game.sport === "MLB" && this.game.status !== "Pre-Game") {
        teams[0].runs = this.game.teams[0].linescoreTotals.hits
        teams[1].runs = this.game.teams[1].linescoreTotals.hits
      }
      return teams
    }
  }
});

Template.singleGameCard.events({
  'click [data-action=register]': function () {
    var userId = Meteor.userId();
    Meteor.call('registerForGame', userId, this.game._id);
    sAlert.success("Registered for " + this.game.name + " !" , {effect: 'slide', position: 'bottom', html: true});
  },
  'click [data-action=unregister]': function () {
    var userId = Meteor.userId();
    Meteor.call('unregisterForGame', userId, this.game._id);
    sAlert.success("Removed Registration for " + this.game.name + "." , {effect: 'slide', position: 'bottom', html: true});
  }
});

Template.singleGameCTA.helpers({
  preGame: function () {
    if (this.game.pre_game_processed === true){
      return true
    }
  },
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
  'click [data-action=play]': function (e, t) {
    Router.go('joinGame.show', {_id: this.game._id});
  }
});

Template.futureGameInfo.helpers({
  border: function(){
    // console.log(this);
    if(this.border === false){
      return "no-border"
    }
  },
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

Template.teamBlock.helpers({
  team: function (statsTeamId) {
    return Teams.findOne({"statsTeamId": statsTeamId});
  },
  upper: function (name) {
    return name.toUpperCase()
  },
  hex: function () {
    if (this.hex){
      return "#" + this.hex[0]
    } else {
      return "#134A8E"
    }
  }
});

Template.rightSection.helpers({
  completed: function () {
    if (this.game.status === "closed" || this.game.status === "completed"){
      return true
    }
  },
  live: function() {
    if (this.game.status === "In-Progress") {
      return true
    }
  },
  scheduled: function () {
    if (this.game.status === "scheduled" || this.game.status === "Pre-Game"){
      return true
    }
  },
  registered: function (){
    var userId = Meteor.userId();
    var list = this.game.registered
    var alreadyRegistered = _.indexOf(list, userId)
    if(alreadyRegistered !== -1) {
      return true
    }
  },
  periodGrammer: function (period) {
    if ( this.game.sport === "MLB" ){
      var period = this.game.eventStatus.inning
    }
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
  time: function () {
    if (this.game && this.game.sport === "NFL" ) {
      var path = this.game.eventStatus
      var seconds = path.seconds.toString()
      if (seconds && seconds.length < 2) {
        var seconds = "0" + seconds
      }
      var string = path.minutes + ":" + seconds
      return string
    }
  },
  tvStation: function (tvStations) {
    if(tvStations[0]){
      return tvStations[0].callLetters
    }
  },
  delayed: function() {
    if ( this.game.eventStatus.eventStatusId === 5 ) {
      return true
    }
  }
});
