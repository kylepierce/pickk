Meteor.publish("userNotificationSettings", function() {
  return UserList.find(this.userId,
    {
      fields: {
        'notifications': 1,
        'pendingNotifications': 1
      }
    });
});