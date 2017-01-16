Template.weekFilter.rendered = function() {
  var userId = Meteor.userId()
  Meteor.subscribe('findThisUsersGroups', Meteor.userId())
};

Template.weekFilter.helpers({
  dates: function () {
		//Sort by all, followers, following, one group
    var data = Session.get('leaderboardFilter');
    var thisWeek = moment().week();
    var day = moment().day();
    if (day < 2){
      var thisWeek = thisWeek - 1
    }
		var list = [{name: "This Week", value: "this-week", date: thisWeek}, {name: "Last Week", value: "last-week", date: thisWeek - 1 }, {name: "Two Weeks Ago", value: "two-weeks", date: thisWeek - 2}]

    _.forEach(list, function(item){
      if(item.date === data.date){
        item.checked = true
      }
    });

		return list
	},
	options: function () {
    var data = Session.get('leaderboardFilter');
		//Sort by all, followers, following, one group
		var list = [{name: "All", filter: "All"}, {name: "Followers", filter: "Followers"}, {name: "Following", filter: "Following"}]
    _.forEach(list, function(item){
      var lower = item.filter.toLowerCase()
      if(lower === data.filter){
        item.checked = true
      }
    });
		return list
	},
	groups: function(){
		var groups = Groups.find({}).fetch();
		var list = []
		_.each(groups, function(group){
			list.push({name: group.name, filter: "group", groupId: group._id})
		});
	return list
	}
});

Template.weekFilter.events({
  'change #date .item-radio': function(e,t){
    var data = Session.get('leaderboardFilter');
    var data = _.extend(data, this.o)
    Session.set('leaderboardFilter', data)
	},
  'change #other-filters .item-radio': function(e,t){
    var data = Session.get('leaderboardFilter');
    var data = _.extend(data, this.o)
    Session.set('leaderboardFilter', data)
	}
});
