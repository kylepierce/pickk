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

// Template.radioOption.helpers({
//   filterSelected: function(o){
//     var data = Session.get('leaderboardData')
//     if(o.period === data.period){
//       return true
//     }
//   }
// });

// var data = Session.get('leaderboardData')
// var filter = data.filter
// var lower = o.name.toLowerCase();
// var filter = filter.toLowerCase();
// if(filter === "group"){
//   var groupId = data.groupId
//   var group = Groups.findOne({_id: groupId})
//   var groupName = group.name
//   if ( groupName === lower){
//     return true
//   }
// } else if(lower === filter){
//   return true
// } else {
//
// }


// Template.dateOption.helpers({
//   filterSelected: function(o){
//     var filter = Session.get('gamesDate')
//     var lower = o.name.toLowerCase();
//     var filter = filter.toLowerCase();
//     if(filter === "group"){
//       var groupId = Session.get('leaderboardGroupId')
//       var group = Groups.findOne({_id: groupId})
//       var groupName = group.name
//       if ( groupName === lower){
//         return true
//       }
//     } else if(filter === "matchup"){
//       var matchupId = Session.get('leaderboardMatchupId')
//       var matchup = Matchup.findOne({_id: matchupId})
//       var matchupName = matchup._id
//       if ( matchupName === lower){
//         return true
//       }
//     } else if(lower === filter){
//       return true
//     } else {
//
//     }
//   }
// });
