Template.gamesFilter.helpers({
	options: function () {
		return ["NFL", "NBA", "MLB"]
	},
  dates: function(){
    var list = [{name: "Day", value: "Day"}, {name: "Week", value: "Week"}, {name: "Month", value: "Month"}]
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
			var selected = userSettings.indexOf(this.o)
			if(selected !== -1){
				return true
			}
		}
	}
});
