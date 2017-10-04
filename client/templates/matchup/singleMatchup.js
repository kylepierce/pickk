Template.singleMatchup.onCreated(function() {

});

Template.singleMatchup.helpers({
  matchup: function(){
    return Matchup.findOne();
  },
  'gameList': function(){
    return this.gameId
  },
  'game': function(gameId) {
    Meteor.subscribe('singleGame', gameId);
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
      _id: this._id
    }
    return obj
  }
});

Template.singleMatchup.events({
  'click [data-action=inviteToMatchup]': function(e, t){
    var matchupId = this._id
    Router.go('/matchup/invite/' + matchupId)
  },
  'click [data-action=joinMatchup]': function(e, t){
    var matchupId = this._id
    var userId = Meteor.userId()
    Meteor.call('joinMatchup', matchupId, userId);
  },
  // 'click [data-action=leaveMatchup]': function(e, t){
  //   var matchupId = this._id
  //   var userId = Meteor.userId();
  //   Meteor.call('leaveMatchup', matchupId, userId);
  // },
  'click [data-action=requestInvite]': function(e, t){
    var userId = Meteor.userId();
    var matchupId = Router.current().params._id
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
    Router.go('/league/' + this.leagueId );
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
      var userId = Meteor.userId()
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
  }
});

Template.matchupMember.events({
  "click [data-action=viewGame]": function(e, t){
     Router.go('/game/' + this.gameId );
  },
  "click [data-action=viewMembers]": function(e, t){
    IonModal.open('_matchupMembers', this);
  },
  "click [data-action=invite]": function(e, t){
     Router.go('/matchup/invite/' + this._id );
  },
  "click [data-action=viewLeaderboard]": function(e, t){
    Router.go('/leaderboard/?filter=matchup&matchupId=' + this._id );
  },
  "click [data-action=viewLeague]": function(e, t) {
    Router.go('/league/' + this.leagueId );
  }
});
