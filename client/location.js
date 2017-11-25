if (Meteor.isCordova) {
	Meteor.startup(function () {
	  navigator.geolocation.getCurrentPosition
	});
}