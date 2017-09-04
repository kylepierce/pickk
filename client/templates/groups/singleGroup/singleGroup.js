Template.singleGroup.rendered = function() {
  Session.set('chatGroup', this.data.group[0]._id)
};

Template.singleGroup.events({
  "click [data-action=createMatchup]": function(){
    Router.go('/matchup/create/')
  }
});

Template.singleGroup.helpers({
  group: function() {
    return this.group[0];
  },
  member: function(){
    var userId = Meteor.userId();
    var group = this.group[0]
    var isMember = group.members.indexOf(userId)
    if(isMember > -1) {
      return true
    }
  },
  groupName: function(){
    return this.group[0].name
  },
  visible: function(){
    var userId = Meteor.userId();
    var group = this.group[0]
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
    var group = this.group[0]
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
    var groupId = this.group[0]._id
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
    var commissionerId = this.group[0].commissioner
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
  'click [data-ion-modal=_groupRequests]': function(event, template){
    var groupId = Router.current().params._id
    Session.set('groupId', groupId);
  },
});

Template.leagueLinks.helpers({});

Template.leagueLinks.events({
  'click [data-action=viewMembers]': function(){
    IonModal.open('_leagueMembers', this);
  },
  "click [data-action=invite]": function(){

  },
  "click [data-action=viewLeaderboard]": function(){

  },
});
