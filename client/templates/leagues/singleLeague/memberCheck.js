Template.memberCheck.helpers({
  alreadyFull: function(){
    var numberOfUsers = this.league.members.length
    var limit = this.league.limit
    var max = this.league.limitNum
    if(this.league.limit && this.league.limitNum && limit === true && numberOfUsers >= max){
      return true
    }
  },
  public: function(){
    var isInvited = this.league.invites.indexOf(Meteor.userId())
    if (this.league.secret === "public" || this.league.secret === false) {
      return true
    } else if (isInvited > -1){
      return true
    }
  },
  invite: function(){
    if (this.league.secret === "invite" ) {
      return true
    }
  }
});

Template.memberCheck.events({
  'click [data-action=joinLeague]': function() {
    var currentUserId = Meteor.userId();
    var leagueId = Router.current().params._id
    var league = Groups.findOne({_id: leagueId})
    var leagueName = league.name
    sAlert.success("You Joined " + leagueName , {effect: 'slide', position: 'bottom', html: true});
    // Add this user to the league
    Meteor.call('joinLeague', currentUserId, leagueId);
  },
  'click [data-action=invite]': function(){
    var leagueId = Router.current().params._id
    Router.go('/leagues/invite/' + leagueId)
  },
  'click [data-action=requestInvite]': function(e, t){
    var userId = Meteor.userId();
    var leagueId = Router.current().params._id
    Meteor.call('requestLeagueInvite', userId, leagueId)
  },
  'click [data-action=requestPending]': function(template, event){
    IonActionSheet.show({
      titleText: 'Are you sure you want to remove your league request?',
      buttons: [
        { text: 'Remove Request <i class="icon ion-share"></i>' },
      ],
      destructiveText: '',
      cancelText: 'Cancel',
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
          var user = Meteor.userId();
          var league = Router.current().params._id
          Meteor.call('removeLeagueRequest', user, league)
          return true
        }
      }
    });
  },
  'click [data-action=leaveLeague]': function (event, template) {
    IonActionSheet.show({
      titleText: 'Are You Sure You Want To Leave? You will need to request an invite or be invited to join again!',
      buttons: [
        { text: 'Leave Group <i class="icon ion-share"></i>' },
      ],
      destructiveText: '',
      cancelText: 'Cancel',
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
          var currentUserId = Meteor.userId();
          var leagueId = Router.current().params._id

          // Remove this user from the league
          Meteor.call('leaveLeague', currentUserId, leagueId);
          var league = Groups.findOne({_id: leagueId})
          var leagueName = league.name
          sAlert.success("You Left " + leagueName , {effect: 'slide', position: 'bottom', html: true});
          return true

        }
      }
    });
  },
  // If a user wants to leave it pops up with an alert to confirm.
  'click [data-action=showActionSheet]': function (event, template) {
    IonActionSheet.show({
      titleText: 'Are You Sure You Want To Leave?',
      buttons: [
        { text: 'Leave Group <i class="icon ion-share"></i>' },
      ],
      destructiveText: '',
      cancelText: 'Cancel',
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
          var currentUserId = Meteor.userId();
        var leagueId = Router.current().params._id

        // Remove this user from the league
        Meteor.call('leaveLeague', currentUserId, leagueId);
        var league = Groups.findOne({_id: leagueId})
        var leagueName = league.name
        sAlert.success("You Left " + leagueName , {effect: 'slide', position: 'bottom', html: true});
        return true

        }
      }
    });
  }
});

Template.requestInvite.helpers({
  alreadyRequested: function () {
    var currentUser = Meteor.userId()
    var leagueId = Router.current().params._id
    var league = Groups.findOne({_id: leagueId,
      requests: {$in: [currentUser]}});
      // THis is lazy code but I need to finish
    if(!league) {
      var league = Matchup.findOne({_id: leagueId,
        requests: {$in: [currentUser]}});
    }
    return league
  }
});

Template.inviteOnly.helpers({
  invited: function(){
    var currentUser = Meteor.userId();
    var leagueId = Router.current().params._id
    var league = Groups.findOne({_id: leagueId}, {fields: {invites: 1}});
    if (league) {
      var alreadyInvited = league && league.invites && league.invites.indexOf(currentUser);
      var deeplinkAllowed = Router.current().params.query.deeplinkAllowed

      if( alreadyInvited > -1){
        return true
      } else if (deeplinkAllowed === true){
        return true
      }
    }
  }
});

Template.requestInvite.events({

})
