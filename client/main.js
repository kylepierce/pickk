function showCard  () {
	$("#card").css( "display", "inherit" );
	$("#yes").css( "display", "inherit" );
	$("#no").css( "display", "inherit" );
	$(".no-question").css( "display", "none" );
}

function removeCard () {
	$("#card").css( "display", "none" );
	$("#yes").css( "display", "none" );
	$("#no").css( "display", "none" );
	$(".no-question").css( "display", "inherit" );
}


Meteor.startup(function() {
	 $("#no").click(function(event) {
	 	event.preventDefault();
	 	removeCard()
	 	console.log("Answered No");
	});

	 $("#yes").click(function(event) {
	 	event.preventDefault();
		removeCard()
	 	console.log("Answered Yes");
	});

	 $("#show").click(function(event) {
	 	event.preventDefault();
		showCard()
	});
});