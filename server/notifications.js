createPendingNotification = function(userId, notificationId, type, message) {
  Meteor.users.update(userId,
    {
      $push: {
        pendingNotifications: {
          _id: Random.id(),
          type: type,
          read: false,
          notificationId: notificationId,
          dateCreated: new Date(),
          message: message
        }
      }
    }
  );
};
