// Template.singleGameFilter.rendered = function() {
//   var userId = Meteor.userId()
//   Meteor.subscribe('findThisUsersLeagues', Meteor.userId())
// };
//
// Template.singleGameFilter.helpers({
//   dates: function() {
//     var data = Session.get('leaderboardData')
//     var list = []
//     var nameList = ["1st Quarter", "2nd Quarter", "3rd Quarter", "4th Quarter", "Overtime" ]
//     var game = Games.find().fetch();
//     var period = game[0].period;
//     data.period = parseInt(data.period)
//
//     for (var i = 0; i < period; i++) {
//       var name = nameList[i]
//       var periodObj = {name: name, value: i+1, period: i+1 }
//       if(i+1 === period && !data.period ){
//         periodObj.checked = true
//       } else if (i+1 === data.period) {
//         periodObj.checked = true
//       }
//       list.push(periodObj)
//     }
// 		return list
//   },
//   options: function () {
//     var data = Session.get('leaderboardData');
//     var options = ["All", "Live", "Drive", "Followers", "Following"]
// 		var list = []
//
//     _.each(options, function(option){
//       var item = {name: option, filter: option}
//       if(!data.filter && option === "All") {
//         item.checked = true
//       } else if(data.filter === option){
//         item.checked = true
//       }
//       list.push(item)
// 		});
// 		return list
// 	},
// 	groups: function(){
//     var data = Session.get('leaderboardData');
// 		var groups = Groups.find({}).fetch();
// 		var list = []
// 		_.each(groups, function(group){
//       var item = {name: group.name, filter: "group", groupId: group._id}
//       if (data.filter === "group" && data.groupId === group._id){
//         item.checked = true
//       }
// 			list.push(item)
// 		});
// 	  return list
//   },
//   matchups: function(){
//     var data = Session.get('leaderboardData');
//     var matchups = Matchup.find({}).fetch();
//     var list = []
//     _.each(matchups, function(matchup){
//       var groupId = matchup.groupId
//
//       if(groupId){
//         var group = Groups.find({_id: groupId}).fetch();
//         var matchupName = group[0].name
//       } else {
//         var userId = matchup.commissioner
//         var user = UserList.find({_id: userId}).fetch()
//         var matchupName = user[0].profile.username
//       }
//       var item = {name: matchupName, filter: "matchup", matchupId: matchup._id}
//
//       if (data.filter === "matchup" && data.matchupId === matchup._id){
//         item.checked = true
//       }
//       list.push(item)
//     });
//   return list
//   }
// });
//
// Template.singleGameFilter.events({
// 	'change #period .item-radio': function(e,t){
//     var data = Session.get('leaderboardData');
//     data.period = this.value
//     Session.set('leaderboardData', data)
// 	},
//   'change #other-filters .item-radio': function(e,t){
//     var data = Session.get('leaderboardData');
//     var data = _.extend(data, this.o)
//     Session.set('leaderboardData', data)
// 	}
// });
//
//
// Template._leaderboardFilter.helpers({
//   options: function () {
//     var data = Session.get('leaderboardData');
//     var options = ["All", "Live", "Drive", "Followers", "Following"]
//     var list = []
//
//     _.each(options, function(option){
//       var item = {name: option, filter: option}
//       if(!data.filter && option === "All") {
//         item.checked = true
//       } else if(data.filter === option){
//         item.checked = true
//       }
//       list.push(item)
//     });
//     return list
//   },
//   groups: function(){
//     var data = Session.get('leaderboardData');
//     var groups = Groups.find({}).fetch();
//     var list = []
//     _.each(groups, function(group){
//       var item = {name: group.name, filter: "group", groupId: group._id}
//       if (data.filter === "group" && data.groupId === group._id){
//         item.checked = true
//       }
//       list.push(item)
//     });
//     return list
//   },
//   matchups: function(){
//     var data = Session.get('leaderboardData');
//     var matchups = Matchup.find({}).fetch();
//     var list = []
//     _.each(matchups, function(matchup){
//       var groupId = matchup.groupId
//       if(groupId){
//         var group = Groups.find({_id: groupId}).fetch();
//         var matchupName = group[0].name
//       } else {
//         var userId = matchup.commissioner
//         var user = UserList.find({_id: userId}).fetch()
//         var matchupName = user[0].profile.username
//       }
//       var item = {name: matchupName, filter: "matchup", matchupId: matchup._id}
//       if (data.filter === "matchup" && data.matchupId === matchup._id){
//         item.checked = true
//       }
//       list.push(item)
//     });
//   return list
//   }
// });
//
// Template._leaderboardFilter.events({
//   'change #other-filters .item-radio': function(e,t){
//     var data = Session.get('leaderboardData');
//     var data = _.extend(data, this.o)
//     Session.set('leaderboardData', data)
//     IonModal.close();
// 	}
// });
