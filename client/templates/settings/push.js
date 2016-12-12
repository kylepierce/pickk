Template.pushPrompt.rendered = function () {
	if (Meteor.isCordova) {
		PushNotification.hasPermission(function(data) {
    if (data.isEnabled) {
      Router.go('/');
    } else if (!data.isEnabled){
			var route = Router.current().originalUrl
    	if(route.includes("newUserFavoriteTeams")) {
        var newOrNah = true
      } else {
        var newOrNah = false
      }
    	IonPopup.confirm({
		    title: 'Push Notifications',
		    template: 'Allow Push Notifications to Get: <ul><li>- When We Award You Prizes</li><li>- Game Invites</li><li>- Game Reminders</li><li>- In Game Reminders</li><li>- And More</li></ul> <br><br><strong>Make Sure To Click "Allow" For Push Notifications</strong>',
		    cancelText: "Don't Allow",
		    okText: "Allow",
		    onOk: function() {
					var data = {
						push: true
					}
			    var userId = Meteor.userId()

			    analytics.identify(userId, data)
		    	analytics.track("accepted push", {
        		id: userId,
        		push: true,
        		new: newOrNah
					});

					enableIntercomNotifications();
					enablePush();
		      intercom.updateUser(data);
		      Router.go('/');
		    },
		    onCancel: function() {
		    	var data = {
						push: false
					}
			    var userId = Meteor.userId()

			    analytics.identify(userId, data)
			    analytics.track("did not accepted push", {
          		id: userId,
          		push: false,
          		new: newOrNah
        		});
			      intercom.updateUser(data);

		      Router.go('/');
		    }
		  });
    }
	});
} else {
	Router.go('/');
}
};
