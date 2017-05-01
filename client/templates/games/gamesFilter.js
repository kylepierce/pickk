Template.gamesFilter.helpers({
	options: function () {
		return ["NFL", "NBA", "MLB"]
	},
  dates: function(){
		var data = Session.get('gamesDate');
    var list = [{name: "Today", value: "Day"}, {name: "Week", value: "Week"}, {name: "Month", value: "month"}, {name: "Last Week", value: "Last-Week"}, {name: "Last Month", value: "Last-Month"}]

		_.forEach(list, function(item){
			var lower = item.value.toLowerCase()
			if(lower === data){
				item.checked = true
			}
		});

		return list
  }
});

Template.gamesFilter.events({
  'change .item-radio': function(e,t){
    Session.set('gamesDate', this.value);
  },
	'change .checkbox': function(e,t){
		Meteor.call('updateGamesFilter', this.o, function(){
			var userSettings = Meteor.user().profile.gamesFilter
			Session.set('gamesBySport', userSettings);
		});
	}
});

Template.gamesOption.helpers({
	alreadySelected: function(){
		var user = Meteor.user()
		if (user){
			var userSettings = Session.get('gamesBySport')
			if(userSettings && userSettings.indexOf(this.o) > -1){
				return true
			}
		}
	}
});
