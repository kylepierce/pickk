Template.games.onCreated(function() {
  var dateFilter = Router.current().params.query.date
	var sport = Router.current().params.query.sport
  if(dateFilter){
    Session.set('gamesDate', dateFilter);
  } else {
    Session.set('gamesDate', "week");
  }

  var usersPref = Meteor.user().profile.gamesFilter
  var favSports = Meteor.user().profile.favoriteSports

  if(sport) {
    var sportArray = [sport]
    Session.set('gamesBySport', sportArray);
  } else if(usersPref) {
    Session.set('gamesBySport', usersPref);
  } else {
    Session.set('gamesBySport', favSports);
  }

  this.getSports = () => Session.get('gamesBySport');
  this.getFilter = () => Session.get('gamesDate');

  this.autorun(() => {
    this.subscribe( 'activeGames', this.getFilter(), this.getSports(), function(){
      $( ".loader-holder" ).delay( 500 ).fadeOut( 'slow', function() {
        $( ".loading-wrapper" ).fadeIn( 'slow' );
        $.each($(".game-container"), function(i, el){
          setTimeout(function(){
            $(el).css("opacity","1");
            $(el).addClass("fadeInRight","200");
          }, 100 + ( i * 100 ));
        });
      });
    });
  });
});

Template.games.onRendered( function() {
  $( "svg" ).delay( 250 ).fadeIn();
});

Template.games.helpers({
  filters: function(){
    var list = []
    var sport = Session.get('gamesBySport');
    var date = Session.get('gamesDate');
    list.push.apply(list, sport);
    list.push(date);
    return list
  },
  noGames: function(){
    var count = Games.find({}).count();
    if (count === 0){
      return true
    }
  },
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
