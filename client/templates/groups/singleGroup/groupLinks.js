Template.groupLinks.helpers({
  links: function(){
    var groupId = this.group[0]._id
    var list = [{title: "Week Leaderboard", url: "/week-leaderboard?filter=group&groupId="+groupId}, {title: "Group Members", url: "/groups/members/" + groupId}]
    return list
  }
});

Template.groupLinks.events({
  "click .item": function(e, t){
    Session.set('leaderboardFilter', null);
  },
});
