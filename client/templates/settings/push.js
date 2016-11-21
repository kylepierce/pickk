Template.pushPrompt.rendered = function () {
  IonPopup.confirm({
    title: 'Push Notifications',
    template: 'Allow Push Notifications to Get: <ul><li>- Group Invites</li><li>- Game Invites</li><li>- Game Reminders</li><li>- In Game Reminders</li><li>- And More</li></ul> <br><br><strong>Make Sure To Click "Allow" For Push Notifications</strong>',
    cancelText: "Don't Allow",
    okText: "Allow",
    onOk: function() {
			var data = {
				push: true
			}
	    var userId = Meteor.userId()

	    analytics.identify(userId, data)
	    if (Meteor.isCordova) {
	    	Push.enabled();
				enableIntercomNotifications();
				enablePush();
	      intercom.updateUser(data);
	    }
      Router.go('/');
    },
    onCancel: function() {
    	var data = {}
	    data["push"] = false
	    var userId = Meteor.userId()

	    analytics.identify(userId, data)
	    if (Meteor.isCordova) {
	      intercom.updateUser(data);
	    }
      console.log("Don't Allow");
      Router.go('/');
    }
  });
};