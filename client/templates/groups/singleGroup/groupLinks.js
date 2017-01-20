Template.groupLinks.helpers({
  links: function(){
    var groupId = this.group[0]._id
    var list = [{title: "Week Leaderboard", url: "/groups/week-leaderboard/" + groupId}, {title: "Group Members", url: "/groups/members/" + groupId}]
    return list
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

Template.groupLinks.events({
  "click .item": function(e, t){
    Session.set('leaderboardFilter', null);
  },
  "click [data-action=_groupRequests]": function(e, t){
    console.log(this.group[0], e, t);
    IonModal.open("_groupRequests", this)
  }
});
