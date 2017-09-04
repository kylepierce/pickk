Template.singleLeague.rendered = function() {
  Session.set('chatGroup', this.data.league._id)
};

Template.singleLeague.events({
  "click [data-action=createMatchup]": function(){
    Router.go('/matchup/create/')
  }
});

Template.singleLeague.helpers({
  group: function() {
    return this.league;
  },
  member: function(){
    var userId = Meteor.userId();
    var group = this.league
    var isMember = group.members.indexOf(userId)
    if(isMember > -1) {
      return true
    }
  },
  groupName: function(){
    return this.league.name
  },
  visible: function(){
    var userId = Meteor.userId();
    var group = this.league
    var isMember = group.members.indexOf(userId)
    if(group.invites){
      var userInvited = group.invites.indexOf(userId)
    } else {
      var userInvited = -1
    }
    var deeplinkAllowed = Router.current().params.query.deeplinkAllowed
    var privacy = group.secret
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
    var groupId = Router.current().params._id
    var group = this.league
    var isMember = group.members.indexOf(userId)
    if(isMember > -1) {
      Session.set('chatGroup', groupId)
      return true
    } else {
      Session.set('chatGroup', null)
      return false
    }
  },
});

Template.leagueMatchups.helpers({
  leagueMatchups: function(){
    var groupId = this.league._id
    var matchups = Matchup.find({groupId: groupId}).fetch();
    if(matchups.length > 0){
      return true
    }
  },
  commissionerAdmin: function(){
    var currentUser = Meteor.userId()
    var groupId = Router.current().params._id
    var group = Groups.findOne({_id: groupId});

    if (group.commissioner == currentUser) {
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
    var groupId = Router.current().params._id
    Router.go('/league/settings/' + groupId);
  },
  'click [data-action=_leagueRequests]': function(event, template){
    IonModal.open('_leagueRequests', this);
  },
});

Template.leagueLinks.helpers({});

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
});
