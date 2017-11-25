Template.pushPrompt.rendered = function () {
	if (Meteor.isCordova) {
		window.plugins.OneSignal.getPermissionSubscriptionState(function (status) {
			var hasPrompted = status.permissionStatus.hasPrompted;
			var staus = status.permissionStatus.status;
			var userId = Meteor.userId()

			if (!status.permissionStatus.hasPrompted) {
				IonPopup.confirm({
					title: 'Push Notifications',
					template: 'Allow Push Notifications to Get: <ul><li>- When We Award You Prizes</li><li>- Game Invites</li><li>- Game Reminders</li><li>- In Game Reminders</li><li>- And More</li></ul> <br><br><strong>Make Sure To Click "Allow" For Push Notifications</strong>',
					cancelText: "Don't Allow",
					okText: "Allow",
					onOk: function () {						
						analytics.track("soft push", {
							id: userId,
							push: true,
						});

						window.plugins.OneSignal.promptForPushNotificationsWithUserResponse(function (accepted) {
							console.log("User accepted notifications: " + accepted);
							analytics.identify(userId, {push: accepted})
							analytics.track("hard push", {
								id: userId,
								push: accepted,
							});
						});
						Router.go("/");
					},
					onCancel: function () {
						analytics.identify(userId, {push: false});
						analytics.track("soft push", {
							id: userId,
							push: false,
						});

						Router.go("/");
					}
				});
			} 
		});
	} else {
		Router.go("/");
	}
};
