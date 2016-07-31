// Add to index.js or the first page that loads with your app.
// For Intel XDK and please add this to your app.js.

document.addEventListener('deviceready', function () {
	Meteor.startup(function () {
		Accounts.onLogin(function() {
			window.initOneSignal();
		});
	});
}, false);

window.initOneSignal = function() {
	// Enable to debug issues.
	// window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

	var notificationOpenedCallback = function(jsonData) {
		//console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
	};

	window.plugins.OneSignal.init(Meteor.settings.public.oneSignal.appId,
		{googleProjectNumber: Meteor.settings.public.oneSignal.android.googleProjectNumber},
		notificationOpenedCallback);

	window.plugins.OneSignal.getIds(function (data) {
		const token = data.userId;
		sendOneSignalToken(token);
	});

	// Show an alert box if a notification comes in when the user is in your app.
	window.plugins.OneSignal.enableInAppAlertNotification(true);
};

window.sendOneSignalToken = function (token) {
	Meteor.call("updateOneSignalToken", token, function (error) {
		if (error) {
			console.error("An error occurred during updateOneSignalToken", error)
		} else {
			console.log("OneSignal token has been successfully updated to ", token);
		}
	});
};

// Function to update the OneSignal tags of a user when Favorite Teams have been added / updated
updateOneSignalTeamTags = function (user) {
	var tags = {};

	var teamCodes = ['ATL','ARI','BAL','BOS','CHC','CHW','CLE','CIN','COL','DET','HOU','KC','LAA','LAD','MIA','MIL','MIN','NYM','NYY','OAK','PHI','PIT','SD','SF','SEA','STL','TB', 'TEX','TOR','WSH'];

	console.log("updating One Signal! " + user.profile.favoriteTeams);

	// Clear out all codes first
	teamCodes.forEach(function (teamCode) {
		tags[teamCode] = "";
	});

	// Add the user selected favorite teams to the tags
	if (user.profile.favoriteTeams) {
	  user.profile.favoriteTeams.forEach(function (team) {
	    tags[team] = 1;
	  });
	}

	// Send the tags to OneSignal
	if (!_.isEmpty(tags)) {
		window.plugins.OneSignal.sendTags(tags);
	}
};
