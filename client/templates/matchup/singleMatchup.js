Template.singleMatchup.onCreated(function() {

});

Template.singleMatchup.helpers({
  matchup: function(){
    return Matchup.findOne();
  },
  'game': function(gameId) {
    Meteor.subscribe('singleGame', gameId);
    var game = Games.findOne({_id: gameId})
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

Template.matchupJoin.helpers({
  notMaxed: function(){
    var matchup = this
    var numOfUsers = this.users.length
    var max = this.limitNum
    if(max === -1){
      return true
    } else if(numOfUsers < max){
      return true
    } else {
      return false
    }
  },
  allowToView: function(){
    var userId = Meteor.userId();
    var deepLinked = Session.get('deepLinked');
    var deeplinkAllowed = Router.current().params.query.deeplinkAllowed
    if (this.secret === "public"){
      return true
    } else if(this.groupId){
      Meteor.subscribe('singleGroup', this.groupId);
      var group = Groups.find({_id: this.groupId}).fetch()
      var isMember = group[0].members.indexOf(userId)
      if(isMember > -1){
        return true
      }
    } else if (deeplinkAllowed === "true"){
      return true
    } else if (deepLinked.matchupId === this._id && deepLinked.allowed === 1){
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
    if(this.groupId) {
      console.log(this);
      return true
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
  }
});

Template.matchupMember.events({
  "click [data-action=viewGame]": function(e, t){
     Router.go('/game/' + this.gameId );
  },
  "click [data-action=viewMembers]": function(e, t){
     Router.go('/matchup/members/' + this._id );
  },
  "click [data-action=viewLeaderboard]": function(e, t){
    Router.go('/leaderboard/' + this.gameId + "?filter=matchup&matchupId=" + this._id );
  },
  "click [data-action=viewLeague]": function(e, t) {
    Router.go('/groups/' + this.groupId );
  }
});
