Meteor.startup(function () {
  Session.set('chatLimit', 10);
  Session.set("reactToMessageId", null);
  
	DeepLinkHandler = function (data) {
	  if (data) {
	    console.log('Data from deep link: ' + JSON.stringify(data));
	  } else {
	    console.log('No data found');
	  }
	} 
 //  Reloader.configure({
	// 	check: 'everyStart', 
	// 	checkTimer: 3000,  //3 seconds
	// 	idleCutoff: 1000 * 60 * 10  //10 minutes
	// });
});