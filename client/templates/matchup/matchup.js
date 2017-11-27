Template.matchup.onCreated(function() {
  var previous = Session.get('matchupFilter');
  var query = Router.current().params.query
  var games = Games.find({}).fetch();
  var list = []
  _.each(games, function(game){
    list.push(game._id)
  });
  //secret, featured, size,
  if(query){
    var data = query
  } else if (previous) {
    var data = previous
  } else {
    var data = {}
  }
  if(!query.gameId){
    data.gameId = {$in: list}
  }
  Session.set('matchupFilter', data)
  var self = this;

	self.getFilter = function () {
    return Session.get('matchupFilter');
  }
	self.autorun(function() {
		self.subscribe( 'upcomingMatchups', self.getFilter());
	});
});

Template.matchup.helpers({
  'anyMatchups': function(){
    var amount = Matchup.find().count();
    if(amount > 0){
      return true
    }
  },
  matchups: function(){
    return Matchup.find({})
  }
});

Template.matchup.events({
  'click [data-action=createMatchup]': function(){
    Router.go('create-matchup');
  },
  'click [data-action=matchupHistory]': function () {
    Router.go('/matchup-history');
  },
});
