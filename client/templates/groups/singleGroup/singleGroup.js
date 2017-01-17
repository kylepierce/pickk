// Template.singleGroup.created = function () {
//   this.autorun(function () {
//     var groupId = Router.current().params._id
//     this.subscription = Meteor.subscribe('groups', groupId) && Meteor.subscribe('findUserGroups', groupId)
//   }.bind(this));
// };

Template.singleGroup.rendered = function() {
  Session.set('chatGroup', this.data.group[0]._id)
};

Template.singleGroup.helpers({
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
  member: function(){
    var userId = Meteor.userId();
    var group = this.group[0]
    var isMember = group.members.indexOf(userId)
    if(isMember > -1) {
      return true
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
  memberCount: function(){
    return this.group[0].members.length
  },
  description: function(){
    return this.group[0].desc
  }
});
