Template.singleLeague.rendered = function() {
  Session.set('chatGroup', this.data.league._id)
};

Template.singleLeague.helpers({
  league: function() {
    return this.league;
  },
  member: function(){
    var userId = Meteor.userId();
    var league = this.league
    var isMember = league.members.indexOf(userId)
    if(isMember > -1) {
      return true
    }
  },
  leagueName: function(){
    return this.league.name
  },
  visible: function(){
    var userId = Meteor.userId();
    var league = this.league
    var isMember = league.members.indexOf(userId)
    if(league.invites){
      var userInvited = league.invites.indexOf(userId)
    } else {
      var userInvited = -1
    }
    var deeplinkAllowed = Router.current().params.query.deeplinkAllowed
    var privacy = league.secret
    if (privacy === "private" || privacy === true) {
      if (isMember > -1 || userInvited > -1 || deeplinkAllowed === "true"){
        return true
      }
    } else {
      return true
    }
  }
});

Template.chatIcon.helpers({
  member: function(){
    var userId = Meteor.userId();
    var leagueId = Router.current().params._id
    var league = this.league
    var isMember = league.members.indexOf(userId)
    if(isMember > -1) {
      Session.set('chatGroup', leagueId)
      return true
    } else {
      Session.set('chatGroup', null)
      return false
    }
  },
});

Template.leagueMatchups.helpers({
  leagueMatchups: function(){
    console.log(this);
    var leagueId = this.league._id
    var matchups = Matchup.find({leagueId: leagueId}).fetch();
    if(matchups.length > 0){
      return true
    }
  },
  commissionerAdmin: function(){
    var currentUser = Meteor.userId()
    var leagueId = Router.current().params._id
    var league = Groups.findOne({_id: leagueId});

    if (league.commissioner == currentUser) {
      return true
    }
  },
});

Template.commissionerLinks.helpers({
  commissioner: function(){
    var commissionerId = this.league.commissioner
    var userId = Meteor.userId();
    if (commissionerId === userId){
      return true
    }
  }
});

Template.commissionerLinks.events({
  "click [data-action=settings]": function(e, t){
    var leagueId = Router.current().params._id
    Router.go('/league/settings/' + leagueId);
  },
  'click [data-action=_leagueRequests]': function(event, template){
    IonModal.open('_leagueRequests', this);
  },
});

Template.leagueLinks.helpers({
  notCommissioner: function(){
    var commissionerId = this.league.commissioner
    var userId = Meteor.userId();
    if (commissionerId !== userId){
      return true
    }
  }
});

Template.leagueLinks.events({
  'click [data-action=viewMembers]': function(){
    IonModal.open('_leagueMembers', this.league);
  },
  "click [data-action=invite]": function(){
    Router.go('/league/invite/' + this.league._id);
  },
  "click [data-action=viewLeaderboard]": function(){
    Router.go('/league/week-leaderboard/' + this.league._id)
  },
  "click [data-action=settings]": function(){
    Router.go('/league/settings/' + this.league._id)
  },
});

// alreadyMember: function() {
//   var currentUserId = Meteor.userId();
//   var groupMembers = Groups.findOne({_id: Router.current().params._id, members: currentUserId});
//
//   // Check to see if user is in the group already.
//   if(groupMembers) {
//     return true
//   }
// },
// // Check to see if the current user is the commissioner.
// commissionerAdmin: function(){
//   var currentUser = Meteor.userId()
//   var groupId = Router.current().params._id
//   var group = Groups.findOne({_id: groupId});
//
//   if (group.commissioner == currentUser) {
//     return true
//   }
// },
