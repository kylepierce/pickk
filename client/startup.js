Meteor.startup(function () {
  Session.set('chatLimit', 10);
  Session.set("reactToMessageId", null);
 //  Reloader.configure({
	// 	check: 'everyStart', 
	// 	checkTimer: 3000,  //3 seconds
	// 	idleCutoff: 1000 * 60 * 10  //10 minutes
	// });
});