Meteor.publish("userNotificationSettings", function() {
	this.unblock()
  return UserList.find(this.userId,
    {
      fields: {
        'notifications': 1,
        'pendingNotifications': 1
      }
    });
});