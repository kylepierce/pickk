
Template.filterMatchups.helpers({
  'games': function(){
    var games = Games.find({}).fetch()
    var data = Session.get('matchupFilter');
    if(data && data.gameId){
      var gameId = data.gameId
    }
    _.each(games, function(game){
      if(game._id === gameId){
        game.checked = true
      }
    });

    return games
  },
  'privacy': function(){
    var data = Session.get('matchupFilter');
    var options = ["Invite", "Public"]
    if(data && data.secret){
      var secret = data.secret.toLowerCase();
    }
		var list = []

    _.each(options, function(option){
      var lower = option.toLowerCase();

      var item = {name: option, secret: lower}
      if(data === {} && option === "Public") {
        item.checked = true
      } else if(secret === lower){
        item.checked = true
      }
      list.push(item)
		});

		return list
  },
  'featured': function(){
    var data = Session.get('matchupFilter');
    var options = ["True", "False"]
    // if(data && data.featured){
    //   var featured = data.featured.toLowerCase();
    // }
		var list = []

    _.each(options, function(option){
      var lower = option.toLowerCase();
      var item = {name: option, featured: lower}
      if(data === {} && option === "True") {
        item.checked = true
      }
      // else if(data.featured === lower){
      //   item.checked = true
      // }
      list.push(item)
		});

		return list
  },
  'size': function(){
    var data = Session.get('matchupFilter');
    var options = [{name: "1v1", size: 2}, {name: "4 Users", size: 4}, {name: "8 Users", size: 8}, {name: "16 Users", size: 16}, {name: "32 Users", size: 32}, {name: "No Limit", size: -1}]

    if(data && data.size){
      var converted =parseInt(data.size);
    }

    _.each(options, function(option){
      if(!data){
        if(option.size === -1) {
          option.checked = true
        }
      } else if(converted === option.size){
        option.checked = true
      }
		});
		return options
  },
});

Template.filterMatchups.events({
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
