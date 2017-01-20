
Template.matchupFilter.helpers({
  'games': function(){
    var games = Games.find({}).fetch()
    return games
  },
  'privacy': function(){
    var data = Session.get('upcomingMatchups');
    var options = ["Invite", "Public"]
		var list = []

    _.each(options, function(option){
      var lower = option.toLowerCase();
      var item = {name: option, secret: lower}
      if(data === {} && option === "Public") {
        item.checked = true
      } else if(data && data.secret === option){
        item.checked = true
      }
      list.push(item)
		});
		return list
  },
  'featured': function(){
    var data = Session.get('upcomingMatchups');
    var options = ["True", "False"]
		var list = []

    _.each(options, function(option){
      var lower = option.toLowerCase();
      var item = {name: option, featured: lower}
      if(data === {} && option === "Public") {
        item.checked = true
      } else if(data && data.featured === option){
        item.checked = true
      }
      list.push(item)
		});
		return list
  },
  'size': function(){
    var data = Session.get('upcomingMatchups');
    var options = [{name: "You vs Another", size: 2}, {name: "4 Users", size: 4}, {name: "8 Users", size: 8}, {name: "16 Users", size: 16}, {name: "32 Users", size: 32}, {name: "No Limit", size: -1}]

    _.each(options, function(option){
      if(!data){
        if(option.size === -1) {
          options.checked = true
        }
      } else if(data && data.size === option.size){
        options.checked = true
      }
		});
		return options
  },
});

Template.matchupFilter.events({
  "click #matchup .item-radio": function(e, t){
    var data = Session.get('matchupFilter');
    data["gameId"] = this.o._id
    Session.set('matchupFilter', data)
  },
  "click #privacy .item-radio": function(e, t){
    var data = Session.get('matchupFilter');
    data["secret"] = this.o.secret
    Session.set('matchupFilter', data)
  },
  "click #featured .item-radio": function(e, t){
    var data = Session.get('matchupFilter');
    data["featured"] = $.parseJSON(this.o.featured);
    Session.set('matchupFilter', data)
  },
  "click #size .item-radio": function(e, t){
    var data = Session.get('matchupFilter');
    data["limitNum"] = this.o.size
    Session.set('matchupFilter', data)
  },
});
