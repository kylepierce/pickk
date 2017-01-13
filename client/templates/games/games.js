Template.games.onCreated(function() {
  var dateFilter = Router.current().params.query.date
	var sport = Router.current().params.query.sport
  if(dateFilter){
    Session.set('gamesDate', dateFilter);
  } else {
    Session.set('gamesDate', "week");
  }

  if(sport) {
    var sportArray = [sport]
    Session.set('gamesBySport', sportArray);
  } else {
    Session.set('gamesBySport', Meteor.user().profile.gamesFilter);
  }

  this.getSports = () => Session.get('gamesBySport')
  this.getFilter = () => Session.get('gamesDate');

  this.autorun(() => {
    this.subscribe( 'activeGames', this.getFilter(), this.getSports());
  });
});

Template.games.helpers({
  games: function(){
    return Games.find({}).fetch();
  },
  gameClass: function () {
    return "game-item-" + this['status'];
  },

  hasActiveGames: function () {
		return Template.instance().data.games.length > 0;
  },

  inprogress: function (status) {
    if (status == "inprogress"){
      return true
    }
  },

  admin: function () {
    var user = Meteor.user()
    if (user.profile.role === "admin"){
      return true
    }
  },
});

Template.games.events({
  'click [data-action=gameAdmin]': function (e, t) {
    var gameId = $(e.currentTarget).attr("data-game-id");
    Router.go('/admin/game/' + gameId + "/1")
  }
});
