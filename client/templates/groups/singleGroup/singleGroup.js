// Template.singleGroup.created = function () {
//   this.autorun(function () {
//     var groupId = Router.current().params._id
//     this.subscription = Meteor.subscribe('groups', groupId) && Meteor.subscribe('findUserGroups', groupId)
//   }.bind(this));
// };

Template.singleGroup.rendered = function() {
  Session.set('chatGroup', this.data.group[0]._id)
};
Template.singleGroup.events({
  "click [data-action=createMatchup]": function(){
    Router.go('/matchup/create/')
  }
});

Template.singleGroup.helpers({
  leagueMatchups: function(){
    var groupId = this.group[0]._id
    var matchups = Matchup.find({groupId: groupId}).fetch();
    console.log(matchups);
    if(matchups.length > 0){
      return true
    }
  },
  matchups: function(){
    var groupId = this.group[0]._id
    var matchups = Matchup.find({groupId: groupId});
    return matchups
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
    var privacy = group.secret
    if (privacy === "private" || privacy === true) {
      if (isMember > -1 || userInvited > -1){
        return true
      }
    } else {
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

Template.groupData.helpers({
  name: function(){
    return this.group[0].name
  },
  commissioner: function() {
    var commissionerId = this.group[0].commissioner
    Meteor.subscribe('findSingle', commissionerId)
    var user = UserList.findOne({_id: commissionerId});
    return user.profile.username
  },
  skill: function(){
    if (this.group[0].skill) {
      return this.group[0].skill
    }
  },
  league: function(){
    if(this.group[0].leagueAssociation){
      return true
    }
  },
  association: function(){
    if(this.group[0].association){
      return this.group[0].association
    }
  },
  team: function(){
    if(this.group[0].teamAssociation){
      return true
    }
  },
  favTeam: function(){
    var group = this.group[0]
    var league = group.association
    var selector = "favorite" + league + "Team"
    var team = group[selector]
    var team = team.substring(4).toUpperCase();
    // console.log(group, league, selector, team);
    return team
  },
  memberCount: function(){
    return this.group[0].members.length
  },
  max: function(){
    if(this.group[0].limit){
      var number = this.group[0].limitNum
      return "/ " + number
    }
  },
  description: function(){
    return this.group[0].desc
  }
});
