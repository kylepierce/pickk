Template.singleMatchup.onCreated(function() {

});

Template.singleMatchup.helpers({
  matchup: function(){
    return Matchup.findOne();
  },
  'users': function (userArray){
    return userArray.length
  },
  'username': function(ref) {
		Meteor.subscribe('findSingle', ref);
		return UserList.findOne({_id: ref}).profile.username
	},
  'matchupName': function(matchup){
    var groupId = matchup.groupId

    if(groupId){
      Meteor.subscribe('singleGroup', groupId);
      var group = Groups.find({_id: groupId}).fetch();
      var matchupName = group[0].name
    } else {
      var userId = matchup.commissioner
      var user = UserList.find({_id: userId}).fetch()
      var matchupName = user[0].profile.username
    }
    return matchupName
  },
  'gameName': function(gameId){
    Meteor.subscribe('singleGameData', gameId);
    var game = Games.findOne({_id: gameId})
    if (game){
      return game.name
    }
  },
  'alreadyJoined': function(users){
    var userId = Meteor.userId();
    var onList = users.indexOf(userId)
    if(onList >= 0){
      return true
    }
  },
  'limitNum': function(){
    if(this.limitNum === -1){
      return "∞"
    } else {
      return this.limitNum
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
  'click [data-action=leaveMatchup]': function(e, t){
    var matchupId = this._id
    var userId = Meteor.userId();
    Meteor.call('leaveMatchup', matchupId, userId);
  },
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
  allowToJoin: function(){
    var userId = Meteor.userId();
    var deepLinked = Session.get('deepLinked')
    var deeplinkAllowed = Router.current().params.query.deeplinkAllowed
    if(this.groupId){
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
  }, request: function(){
    var invited = this.secret
    var userId = Meteor.userId();
    var onTheList = this.requests.indexOf(userId);
    if(invited){
      return true
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
});
