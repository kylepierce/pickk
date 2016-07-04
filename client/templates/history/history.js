Template.history.created = function () {
	var userId = Meteor.userId();
  this.autorun(function () {
    this.subscription = Meteor.subscribe('gamesUserPlayedIn', userId);
  }.bind(this));
};

Template.history.onRendered( function() {
  $( "svg" ).delay( 0 ).fadeIn();
});

Template.history.onCreated( function() {
  this.subscribe( 'gamesUserPlayedIn', function() {
    $( ".loader" ).delay( 100 ).fadeOut( 'fast', function() {
      $( ".loading-wrapper" ).fadeIn( 'fast' );
    });
  });
});

Template.history.helpers({
	gamePlayed: function(){
		var userId = Meteor.userId();
		var selector = {users: {$in: [userId]}}
  	return Games.find(selector, {sort: {dateCreated: -1}});
	}
});
