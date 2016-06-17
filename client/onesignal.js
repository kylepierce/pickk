// Add to index.js or the first page that loads with your app.
// For Intel XDK and please add this to your app.js.

document.addEventListener('deviceready', function () {
	// Enable to debug issues.
	// window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

	var notificationOpenedCallback = function(jsonData) {
		//console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
	};

	window.plugins.OneSignal.init(Meteor.settings.public.oneSignal.appId,
		{googleProjectNumber: Meteor.settings.public.oneSignal.android.googleProjectNumber},
		notificationOpenedCallback);

	window.plugins.OneSignal.getIds(function (data) {
		window.oneSignalToken = data.userId;
		if (Meteor.user()) {
			sendOneSignalToken();
		}
	});

	// Show an alert box if a notification comes in when the user is in your app.
	window.plugins.OneSignal.enableInAppAlertNotification(true);
}, false);

window.sendOneSignalToken = function () {
	const token = window.oneSignalToken;
	Meteor.call("updateOneSignalToken", token, function (error) {
		if (error) {
			console.error("An error occurred during updateOneSignalToken", error)
		} else {
			window.oneSignalTokenIsSent = true;
			console.log("OneSignal token has been successfully updated to ", token);
		}
	});
};

Meteor.startup(function () {
	Accounts.onLogin(function() {
		if (window.oneSignalToken && ! window.oneSignalTokenIsSent) {
			window.sendOneSignalToken();
		}
	});
});
