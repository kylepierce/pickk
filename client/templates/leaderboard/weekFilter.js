Template.weekFilter.rendered = function() {
  var userId = Meteor.userId()
  Meteor.subscribe('findThisUsersGroups', Meteor.userId())
};

Template.weekFilter.helpers({
	options: function () {
		//Sort by all, followers, following, one group
		var list = [{name: "All", value: "All"}, {name: "Followers", value: "Followers"}, {name: "Following", value: "Following"}]
		return list
	},
	groups: function(){
		var groups = Groups.find({}).fetch();
		var list = []
		_.each(groups, function(group){
			list.push({name: group.name, value: "group", groupId: group._id})
		});
	return list
	}
});

Template.weekFilter.events({
	'change .item-radio': function(e,t){
		Session.set('leaderboardFilter', this.value);
		Session.set('leaderboardGroupId', this.groupId);
	}
});

Template.radioOption.helpers({
  filterSelected: function(o){
    var filter = Session.get('leaderboardFilter')
    var lower = o.name.toLowerCase();
    var filter = filter.toLowerCase();
    if(filter === "group"){
      var groupId = Session.get('leaderboardGroupId')
      var group = Groups.findOne({_id: groupId})
      var groupName = group.name
      if ( groupName === lower){
        return true
      }
    } else if(lower === filter){
      return true
    } else {

    }
  }
});
