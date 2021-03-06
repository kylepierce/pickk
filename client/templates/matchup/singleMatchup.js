Template.singleMatchup.onCreated(function() {
  this.subscribe('listOfGames', this.data.matchup[0].gameId)
});

Template.singleMatchup.helpers({
  'matchup': function(){
    return Matchup.findOne();
  },
  'gameList': function(){
    return this.gameId
  },
  'game': function(gameId) {
    var game = Games.findOne({_id: gameId});
    if (game) {
      return game
    }
  },
  'alreadyJoined': function(users){
    if(users){
      var userId = Meteor.userId();
      var onList = users.indexOf(userId)
      if(onList >= 0){
        return true
      }
    }
  },
  'data': function(){
    var obj = {
      limit: 2,
      type: "matchup",
      period: this.period,
      _id: this._id
    }
    return obj
  },
  'gameHasStarted': function(){
    var gameId = this.gameId[0]
    var games = Games.find({}).map(function(game){
      return game.status
    });
    
    var inProgress = games.indexOf("In-Progress");
    var final = games.indexOf("Final");
    if(inProgress > -1 || final > -1){
      return true
    }
  },
  "sponsored": function(){
    if(this.sponsored){
      return true
    }
  }
});

Template.singleMatchup.events({
  'click [data-action=inviteToMatchup]': function(e, t){
    var matchupId = this._id
    analytics.track('Click "Invite Matchup"', {
      matchupId: matchupId,
    });
    Router.go('/matchup/invite/' + matchupId)
  },
  'click [data-action=joinMatchup]': function(e, t){
    var matchupId = this._id
    analytics.track('Click Join Matchup', {
      matchupId: matchupId,
    });
    var userId = Meteor.userId()
    Meteor.call('joinMatchup', matchupId, userId);
  },
  'click [data-action=prizes]': function (e, t) {
    analytics.track('Click "View Prizes"', {
      matchupId: this._id,
    });
    var matchupId = this._id
    var userId = Meteor.userId()
    Router.go('/prizes?matchup=true&matchupId=' + matchupId);
  },
  // 'click [data-action=leaveMatchup]': function(e, t){
  //   var matchupId = this._id
  //   var userId = Meteor.userId();
  //   Meteor.call('leaveMatchup', matchupId, userId);
  // },
  'click [data-action=requestInvite]': function(e, t){
    var userId = Meteor.userId();
    var matchupId = Router.current().params._id
    analytics.track('Click "Request Invite"', {
      matchupId: matchupId,
      request: true,
    });
    Meteor.call('requestMatchInvite',matchupId, userId)
  },
  'click [data-action=requestPending]': function(template, event){
    IonActionSheet.show({
      titleText: 'Are you sure you want to remove your matchup request?',
      buttons: [
        { text: 'Remove Request <i class="icon ion-share"></i>' },
      ],
      destructiveText: '',
      cancelText: 'Cancel',
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
          analytics.track('Click "Request Invite"', {
            matchupId: matchupId,
            request: false,
          });
          var user = Meteor.userId();
          var matchupId = Router.current().params._id
          Meteor.call('removeMatchInvite', matchupId, user)
          return true
        }
      }
    });
  },
});

Template.matchupJoin.events({
  "click [data-action=viewLeague]": function(e, t) {
    var userId = Meteor.userId();
    analytics.track('Click Join Matchup', {
      matchupId: this._id,
      league: true
    });
    Meteor.call('joinMatchup', this._id, userId);
    Meteor.call('joinLeague', userId, this.leagueId);
  },
  "click [data-action=joinMatchup]": function(){
    analytics.track('Click Join Matchup', {
      matchupId: this._id,
      league: false
    });
  }
});

Template.matchupJoin.helpers({
  notMaxed: function(){
    var matchup = this
    if (matchup) {
      var numOfUsers = matchup.users.length
      var max = matchup.limitNum
      if(max === -1){
        return true
      } else if(numOfUsers < max){
        return true
      } else {
        return false
      }
    }
  },
  allowToView: function(){
    var userId = Meteor.userId();
    var deepLinked = Session.get('deepLinked');
    var deeplinkAllowed = Router.current().params.query.deeplinkAllowed
    if (this.secret === "public" ){
      return true
    } else if (this.leagueId) {
      var userId = Meteor.userId()
      var group = Groups.findOne({_id: this.leagueId});
      if(group){
        var isMember = group.members.indexOf(userId)
        var isInvited = group.invites.indexOf(userId)
        if (isMember > -1 ){
          return true
        }
      }
    } else if (deeplinkAllowed === "true"){
      return true
    } else if (deepLinked && deepLinked.matchupId === this._id && deepLinked.allowed === 1){
      return true
    } else if (this.secret === "invite"){
      var invited = this.invites.indexOf(userId)
      if(invited > -1){
        return true
      }
    } else {
      return true
    }
  },
  request: function(){
    var userId = Meteor.userId();
    var onTheList = this.requests.indexOf(userId);
    if(onTheList > -1){
      return true
    }
  },
  league: function () {
    if(this.leagueId) {
      var userId = Meteor.userId();
      var group = Groups.findOne({_id: this.leagueId});
      if(group){
        var isMember = group.members.indexOf(userId)
        var isInvited = group.invites.indexOf(userId)
        if(isMember > -1){
          return false
        } else if(isInvited > -1){
          return true
        } else if (group.secret === "public" ){
          return true
        } else {
          return false
        }
      }
    }
  }
});

Template.matchupMember.helpers({
  "ifPlayer": function(){
    var userId = Meteor.userId();
    var list = this.users
    var onList = list.indexOf(userId);
    if (onList > 0){
      return "cta-button"
    }
  },
  "league": function(){
    if(this.secret === "league"){
      return true
    }
  },
  'gameHasStarted': function () {
    var gameId = this.gameId[0]
    var games = Games.find({}).map(function (game) {
      return game.status
    });

    var inProgress = games.indexOf("In-Progress");
    var final = games.indexOf("Final");
    if (inProgress > -1 || final > -1) {
      return true
    }
  },
});

Template.matchupMember.events({
  "click [data-action=viewGame]": function(e, t){
    analytics.track('Click "View Game"', {});
    Router.go('/game/' + this.gameId );
  },
  "click [data-action=viewMembers]": function(e, t){
    analytics.track('Click "Players"', {
      location: "Matchup"
    });
    IonModal.open('_matchupMembers', this);
  },
  "click [data-action=invite]": function(e, t){
    analytics.track('Click "Invite"', {
      location: "Matchup"
    });
    Router.go('/matchup/invite/' + this._id );
  },
  "click [data-action=viewLeaderboard]": function(e, t){
    analytics.track('Click "Leaderboard"', {
      location: "Matchup"
    });
    var url = '/leaderboard/?type=matchup&_id=' + this._id
    Router.go(url);
  },
  "click [data-action=viewLeague]": function(e, t) {
    analytics.track('Click "View League"', {});
    Router.go('/league/' + this.leagueId );
  }
});
