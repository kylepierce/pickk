Template.singleGameFilter.onCreated(function () {
  var data = Session.get('leaderboardData');
  var userId = Meteor.userId()
  // this.subscribe('findThisUsersLeagues', Meteor.userId());
  var selector = { gameId: {$in: data.gameId} };
  this.subscribe('listOfMatchups', selector);
});

Template.singleGameFilter.helpers({
  gameSelected: function(){
    var data = Session.get('leaderboardData');
    if(data.type === "game"){
      return true
    }
  },
  dates: function() {
    var data = Session.get('leaderboardData')
    var list = []
    var nameList = ["Pre-Game Pickks", "1st Quarter", "2nd Quarter", "3rd Quarter", "4th Quarter", "Overtime" ]

    for (var i = 0; i < nameList.length; i++) {
      var name = nameList[i]
      var periodObj = {name: name, value: i, period: i }
      var inList = data.period.indexOf(periodObj.period) > -1
      if (inList){
        periodObj.checked = true
      }
      list.push(periodObj)
    }
		return list
  },
  options: function () {
    var data = Session.get('leaderboardData');
    var options = [
      { name: "All", type: "game", playType: ["live", "drive"]}, 
      { name: "Live", type: "game", playType: ["live"]}, 
      { name: "Drive", type: "game", playType: ["drive"]}
    ]

    return _.map(options, function(option){
      if(!data.filter && option.name === "All") {
        option.checked = true
      } else if(data.filter === option.name){
        option.checked = true
      }
      return option
    });
	},
  groups: function () {
    var data = Session.get('leaderboardData');
    var groups = Groups.find({}).fetch();
    var list = []
    _.each(groups, function (group) {
      var item = { name: group.name, type: "league", leagueId: group._id }
      if (data.filter === "league" && data.leagueId === group._id) {
        item.checked = true
      }
      list.push(item)
    });
    return list
  },
  matchups: function(){
    var data = Session.get('leaderboardData');
    var matchups = Matchup.find({}).fetch();
    var list = []
    _.each(matchups, function(matchup){
      var groupId = matchup.groupId
      if(groupId){
        var group = Groups.find({_id: groupId}).fetch();
        var matchupName = group[0].name + " (" + matchup.matchupLength + ")";
      } else {
        var userId = matchup.commissioner
        var user = UserList.find({_id: userId}).fetch()
        var matchupName = user[0].profile.username + " (" + matchup.matchupLength + ")";
      }
      var item = {name: matchupName, type: "matchup", _id: matchup._id}

      if (data.filter === "matchup" && data.matchupId === matchup._id){
        item.checked = true
      }
      list.push(item)
    });
  return list
  }
});

Template.singleGameFilter.events({
	'change .checkbox': function(e,t){
    var data = Session.get('leaderboardData');
    var alreadySelected = data.period.indexOf(this.o.value);
    if (alreadySelected === -1) {
      data.period.push(this.o.value)
    } else if (alreadySelected > -1) {
      data.period.splice(alreadySelected, 1)
    }
    Session.set('leaderboardData', data)
	},
  'change #other-filters .item-radio': function(e,t){
    var data = Session.get('leaderboardData');
    var data = _.extend(data, this.o)
    Session.set('leaderboardData', data)
	}
});


// Template._leaderboardFilter.helpers({
//   options: function () {
//     var data = Session.get('leaderboardData');
//     var options = ["All", "Live", "Drive", "Followers", "Following"]
//     var list = []

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
//       var item = {name: group.name, type: "league", leagueId: group._id}
//       if (data.filter === "league" && data.leagueId === group._id){
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

Template._leaderboardFilter.events({
  'change #other-filters .item-radio': function(e,t){
    var data = Session.get('leaderboardData');
    var data = _.extend(data, this.o)
    Session.set('leaderboardData', data)
    IonModal.close();
	}
});
