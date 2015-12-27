// Template.leaderboard.created = function () {
//   this.autorun(function () {
//     this.subscription = Meteor.subscribe('worldLeaderboard');
//   }.bind(this));
// };


// Template.leaderboard.onRendered( function() {
//   $( "svg" ).delay( 0 ).fadeIn();
// });

// Template.leaderboard.onCreated( function() {
// 	this.subscribe( 'worldLeaderboard', function() {
//   	$( ".loader" ).delay( 100 ).fadeOut( 'fast', function() {
//     		$( ".loading-wrapper" ).fadeIn( 'fast' );
//   	});
// 	});
// });

Template.leaderboard.helpers({
	'player': function(){
		Fetcher.retrieve("leaderboard", "loadLeaderboard")
		var leaderboard = Fetcher.get("leaderboard")
		var fixed = _.sortBy(leaderboard, function(obj){return obj.profile.coins})
		var list = fixed.reverse()
		return _.first(list, 25)
	},
	'username': function(){
		var twitter = this.services.twitter
  	if(twitter){
   	 return twitter.screenName
  	} else {
   	 return this.profile.username
  	}
	}
}); 

