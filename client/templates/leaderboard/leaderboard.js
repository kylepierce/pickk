// Template.leaderboard.onCreated( function() {
//   this.subscribe( 'leaderboard', function() {
//   	$( ".slider-pager" ).css('display', 'none');
//     $( ".loader" ).delay( 1000 ).fadeOut( 'slow', function() {
//       $( ".loading-wrapper" ).fadeIn( 'slow' );
//       $( ".slider-pager" ).css('display', 'block');
//  	 });
// 	});
// });

// Template.leaderboard.onRendered( function() {
//   $( "svg" ).delay( 750 ).fadeIn(); 
// });

// Create a list function baed on the number of users. It can be repeated.

Template.leaderboard.helpers({
	'player': function(){
		return UserList.find(
			{},
			{sort: {"profile.coins": -1}, limit: 25}
			).fetch();
	}
}); 
