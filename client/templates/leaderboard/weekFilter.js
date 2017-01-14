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
    var data = Session.get('leaderboardData')
		// Session.set('leaderboardFilter', this.value);
		// Session.set('leaderboardGroupId', this.groupId);
	}
});
